import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Lock, Sparkles, ChevronRight, ChevronDown, ChevronLeft, Crown, UserPlus, Plus, X, Check, AlertCircle, Database, Key, DollarSign, UserCog, MoreVertical } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { getOrganizationMembers, getOrganizationPillars, updateMemberPillars, updateUserRole } from '../../services/roleService';
import { useAuthStore } from '../../stores/authStore';
import { SignInLoader } from '../shared/SignInLoader';
import { ErrorDisplay } from '../shared/ErrorDisplay';
import { PillarBadgeWithTooltip } from '../shared/PillarBadgeWithTooltip';

const adminHeaderLinks = [
  { label: 'Home', path: '/offerings' },
  { label: 'Assessments', path: '/my-assessments' },
  { label: 'Results', path: '/completed-assessments' },
  { label: 'Use Cases', path: '/usecases' },
];

// Hardcoded JSON data (will be replaced with API data later)
const ROLES_DATA = {
  roles: [
    {
      id: 'super-admin',
      name: 'Super Admin',
      description: 'Full system access with all permissions. Can manage all roles and users.',
      permissions: [
        'Manage Users',
        'Manage Roles',
        'View All Assessments',
        'Edit All Assessments',
        'Delete Assessments',
        'Export Data',
        'System Settings',
        'Billing Management',
        'Audit Logs',
        'API Access',
        'Data Management',
        'Security Settings',
        'Backup & Restore',
        'Integration Management',
        'Custom Reports',
        'Advanced Analytics',
        'Super Admin Access'
      ],
      assignedUsers: ['user1', 'user2']
    },
    {
      id: 'module-assignment',
      name: 'Module Assignment',
      description: 'Can manage assessments, view results, and assign team members to their modules.',
      permissions: [
        'Create Assessments',
        'Edit Assessments',
        'View Results',
        'Export Reports',
        'Assign Team Members',
        'View Analytics'
      ],
      assignedUsers: ['user3', 'user4', 'user5']
    },
    {
      id: 'data-module',
      name: 'Data Module',
      description: 'Manages data access, data governance, and data analytics across the organization.',
      permissions: [
        'View Data',
        'Export Data',
        'Data Governance',
        'Data Analytics',
        'Data Backup',
        'Data Integration'
      ],
      assignedUsers: ['user7', 'user8']
    },
    {
      id: 'security-module',
      name: 'Security Module',
      description: 'Manages security settings, access controls, and compliance across the system.',
      permissions: [
        'Security Settings',
        'Access Control',
        'Audit Logs',
        'Compliance Management',
        'Security Reports',
        'Threat Monitoring'
      ],
      assignedUsers: ['user9']
    },
    {
      id: 'billing-contact',
      name: 'Billing Contact',
      description: 'Manages billing information and subscription settings.',
      permissions: [
        'View Billing',
        'Update Payment Method',
        'View Invoices',
        'Manage Subscription'
      ],
      assignedUsers: ['user6']
    }
  ],
  users: [
    { id: 'user1', name: 'Sarah Johnson', email: 'sarah.j@company.com' },
    { id: 'user2', name: 'Michael Chen', email: 'michael.c@company.com' },
    { id: 'user3', name: 'Emily Rodriguez', email: 'emily.r@company.com' },
    { id: 'user4', name: 'David Kim', email: 'david.k@company.com' },
    { id: 'user5', name: 'Jessica Williams', email: 'jessica.w@company.com' },
    { id: 'user6', name: 'Robert Taylor', email: 'robert.t@company.com' },
    { id: 'user7', name: 'Alexandra Martinez', email: 'alexandra.m@company.com' },
    { id: 'user8', name: 'James Wilson', email: 'james.w@company.com' },
    { id: 'user9', name: 'Lisa Anderson', email: 'lisa.a@company.com' }
  ],
  allPermissions: [
    'Manage Users',
    'Manage Roles',
    'View All Assessments',
    'Edit All Assessments',
    'Delete Assessments',
    'Export Data',
    'System Settings',
    'Billing Management',
    'Audit Logs',
    'API Access',
    'Data Management',
    'Security Settings',
    'Backup & Restore',
    'Integration Management',
    'Custom Reports',
    'Advanced Analytics',
    'Super Admin Access',
    'Create Assessments',
    'Edit Assessments',
    'View Results',
    'Export Reports',
    'Assign Team Members',
    'View Analytics',
    'View Billing',
    'Update Payment Method',
    'View Invoices',
    'Manage Subscription',
    'View Data',
    'Data Governance',
    'Data Analytics',
    'Data Backup',
    'Data Integration',
    'Access Control',
    'Compliance Management',
    'Security Reports',
    'Threat Monitoring'
  ]
};

// Get current user ID (this would come from auth context)
const CURRENT_USER_ID = 'user1';

// Available roles for assignment
const AVAILABLE_ROLES = [
  { value: '', label: 'View Only', icon: UserCog, color: 'slate' },
  { value: 'Super Admin', label: 'Super Admin', icon: Crown, color: 'amber' },
  { value: 'Regular member', label: 'Regular member', icon: Users, color: 'blue' },
];

// Available pillars
const AVAILABLE_PILLARS = [
  'Strategic Value & Governance',
  'Workforce Skillset & Organization Structure',
  'Technology & Data',
  'Resilience, Performance & Impact',
  'Ethics, Trust & Responsible AI',
  'Compliance, Security & Risk',
  'Operations & Implementation'
];

// Available modules
  const AVAILABLE_MODULES = [
    { id: 'usecase', name: 'Usecase Module' },
    { id: 'roadmap', name: 'Roadmap Module', comingSoon: true }
  ];

export function RoleManagementPage() {
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState(ROLES_DATA.roles);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState(null);
  const [showPillarModal, setShowPillarModal] = useState(null); // userId for which modal is open
  const [showModuleModal, setShowModuleModal] = useState(null); // userId for which module modal is open
  const [selectedPillars, setSelectedPillars] = useState([]); // Temporary selection in modal
  const [selectedModules, setSelectedModules] = useState([]); // Temporary selection in module modal
  const [openRoleDropdown, setOpenRoleDropdown] = useState(null); // userId for which role dropdown is open
  const [openActionMenu, setOpenActionMenu] = useState(null); // userId for which action menu is open
  const [availablePillars, setAvailablePillars] = useState([]); // Pillars from GET /organization/pillars
  const [isLoadingPillars, setIsLoadingPillars] = useState(false);
  const [pillarsError, setPillarsError] = useState(null);
  const [isSavingPillars, setIsSavingPillars] = useState(false);
  const [savePillarsError, setSavePillarsError] = useState(null);
  const [roleChangeError, setRoleChangeError] = useState(null);
  const [hoveredTooltip, setHoveredTooltip] = useState(null); // { assessmentId, element, pillarNames, x, y }

  // Update tooltip position on scroll/resize
  useEffect(() => {
    if (!hoveredTooltip?.element) return;

    const updatePosition = () => {
      const rect = hoveredTooltip.element.getBoundingClientRect();
      setHoveredTooltip(prev => ({
        ...prev,
        x: rect.left + rect.width / 2,
        y: rect.top,
      }));
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [hoveredTooltip?.element]);

  // Transform API members data to component shape (shared for initial load and refetch after pillar save)
  // API returns pillar_data: [{ uuid, name }, ...] per user
  const transformMembersData = (data) => {
    return (data || []).map((member) => {
      let roleName = '';
      if (member.IsSuperAdmin === true) {
        roleName = 'Super Admin';
      } else if (member.IsViewOnly === true) {
        roleName = '';
      } else {
        roleName = 'Regular member';
      }
      const pillarData = member.pillar_data || [];
      const assignedPillarNames = pillarData.map((p) => (typeof p === 'object' && p !== null ? (p.name || p.title || p.pillar_name || '') : String(p)));
      return {
        id: member.user_id,
        name: member.full_name || member.email,
        email: member.email,
        role: roleName,
        status: member.status || 'active',
        assignedPillars: assignedPillarNames,
        assignedModules: member.assigned_modules || [],
        isBillingContact: member.IsBillingAdmin === true || false,
      };
    });
  };

  // Fetch organization members from API
  useEffect(() => {
    const fetchMembers = async () => {
      if (!currentUser?.organization_id) {
        setMembersError('Organization ID not found');
        setIsLoadingMembers(false);
        return;
      }

      setIsLoadingMembers(true);
      setMembersError(null);

      try {
        const result = await getOrganizationMembers(currentUser.organization_id);
        if (result.success) {
          setUsers(transformMembersData(result.data));
        } else {
          setMembersError(result.error || 'Failed to load organization members');
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        setMembersError('An unexpected error occurred while loading members');
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [currentUser?.organization_id]);

  // Get role icon component
  const getRoleIcon = (roleName) => {
    const role = AVAILABLE_ROLES.find(r => r.value === roleName);
    return role?.icon || UserCog;
  };

  // Get role color
  const getRoleColor = (roleName) => {
    const role = AVAILABLE_ROLES.find(r => r.value === roleName);
    if (!roleName || roleName === '') return 'slate'; // View Only
    return role?.color || 'slate';
  };

  // Get role stats
  const getRoleStats = () => {
    return {
      'Super Admin': users.filter(u => u.role === 'Super Admin').length,
      'Regular member': users.filter(u => u.role === 'Regular member').length,
      'View Only': users.filter(u => !u.role || u.role === '').length,
      'Billing Contact': users.filter(u => u.isBillingContact).length,
    };
  };

  const stats = getRoleStats();
  const superAdminCount = users.filter(u => u.role === 'Super Admin').length;

  // Map display role to API role for PATCH /organization/users/role
  const displayRoleToApiRole = (displayRole) => {
    if (displayRole === 'Super Admin') return 'super_admin';
    if (displayRole === 'Regular member') return 'regular_member';
    return 'view_only'; // View Only or empty
  };

  // Handle role change – call API then update local state on success
  const handleRoleChange = async (userId, newRole) => {
    setRoleChangeError(null);
    const user = users.find(u => u.id === userId);

    // Check if trying to remove Super Admin role from last Super Admin
    if (user?.role === 'Super Admin' && newRole !== 'Super Admin') {
      if (superAdminCount <= 1) {
        console.error('Cannot remove the last Super Admin role');
        return;
      }
    }

    const apiRole = displayRoleToApiRole(newRole);
    const roles = user.isBillingContact ? [apiRole, 'billing_admin'] : [apiRole];
    const result = await updateUserRole(userId, roles);

    if (result.success) {
      setRoleChangeError(null);
      setUsers(users.map(u =>
        u.id === userId ? { ...u, role: newRole } : u
      ));
      setRoles(roles.map(role => {
        if (role.assignedUsers.includes(userId)) {
          return { ...role, assignedUsers: role.assignedUsers.filter(id => id !== userId) };
        }
        if (newRole && role.name === newRole) {
          return { ...role, assignedUsers: [...role.assignedUsers, userId] };
        }
        return role;
      }));
    } else {
      setRoleChangeError(result.error || 'Failed to update role');
    }
  };

  // Handle billing contact checkbox – call update role API with current role ± billing_admin
  const handleBillingContactChange = async (userId, checked) => {
    setRoleChangeError(null);
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const currentApiRole = displayRoleToApiRole(user.role);
    const roles = checked ? [currentApiRole, 'billing_admin'] : [currentApiRole];
    const result = await updateUserRole(userId, roles);
    if (result.success) {
      setRoleChangeError(null);
      setUsers(users.map(u =>
        u.id === userId ? { ...u, isBillingContact: checked } : u
      ));
    } else {
      setRoleChangeError(result.error || 'Failed to update billing contact');
    }
  };

  // Handle opening pillar assignment modal – calls GET /api/v1/organization/pillars
  const handleOpenPillarModal = async (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedPillars(user?.assignedPillars || []);
    setShowPillarModal(userId);
    setAvailablePillars([]);
    setPillarsError(null);
    setIsLoadingPillars(true);

    try {
      const result = await getOrganizationPillars();
      if (result.success) {
        const data = result.data;
        const pillarList = Array.isArray(data) ? data : (data?.pillars || data?.data || []);
        const sortedPillars = [...pillarList].sort((a, b) => (a.order ?? a.pillar_order ?? 0) - (b.order ?? b.pillar_order ?? 0));
        setAvailablePillars(sortedPillars);
      } else {
        setPillarsError(result.error || 'Failed to load pillars');
      }
    } catch (error) {
      console.error('Error fetching pillars:', error);
      setPillarsError('An unexpected error occurred while loading pillars');
    } finally {
      setIsLoadingPillars(false);
    }
  };

  // Handle closing pillar assignment modal
  const handleClosePillarModal = () => {
    setShowPillarModal(null);
    setSelectedPillars([]);
    setSavePillarsError(null);
    setAvailablePillars([]);
    setPillarsError(null);
  };

  // Handle toggling pillar selection
  const handleTogglePillar = (pillar) => {
    setSelectedPillars(prev => 
      prev.includes(pillar)
        ? prev.filter(p => p !== pillar)
        : [...prev, pillar]
    );
  };

  // Handle saving pillar assignments
  const handleSavePillars = async () => {
    if (!showPillarModal) return;

    if (!showPillarModal) {
      setSavePillarsError('Assigned user ID not found');
      return;
    }

    setIsSavingPillars(true);
    setSavePillarsError(null);

    try {
      // Map selected pillar names to their IDs
      const pillarIds = selectedPillars
        .map(pillarName => {
          const pillar = availablePillars.find(p => {
            const pName = (typeof p === 'object' && p !== null) ? (p.name || p.title || p.pillar_name) : p;
            return pName === pillarName;
          });
          return pillar?.id ?? pillar?.pillar_id ?? pillar?.uuid;
        })
        .filter(id => id !== undefined && id !== null);

      const result = await updateMemberPillars(showPillarModal, pillarIds);

      if (result.success) {
        handleClosePillarModal();
        // Refetch users so table shows updated assigned pillars from API
        if (currentUser?.organization_id) {
          try {
            const membersResult = await getOrganizationMembers(currentUser.organization_id);
            if (membersResult.success) {
              setUsers(transformMembersData(membersResult.data));
            }
          } catch (err) {
            console.error('Error refetching members after pillar save:', err);
          }
        }
      } else {
        setSavePillarsError(result.error || 'Failed to save pillar assignments. Please try again.');
      }
    } catch (error) {
      console.error('Error saving pillars:', error);
      setSavePillarsError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSavingPillars(false);
    }
  };

  // Handle removing a pillar from user
  const handleRemovePillar = (userId, pillar) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, assignedPillars: u.assignedPillars.filter(p => p !== pillar) }
        : u
    ));
  };

  // Handle opening module assignment modal
  const handleOpenModuleModal = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedModules(user?.assignedModules || []);
    setShowModuleModal(userId);
    setOpenActionMenu(null); // Close the action menu
  };

  // Check if module is selected
  const isModuleSelected = (moduleId) => {
    return selectedModules.some(m => m.moduleId === moduleId);
  };

  // Handle closing module assignment modal
  const handleCloseModuleModal = () => {
    setShowModuleModal(null);
    setSelectedModules([]);
  };

  // Handle toggling module selection
  const handleToggleModule = (moduleId) => {
    const module = AVAILABLE_MODULES.find(m => m.id === moduleId);
    if (module?.comingSoon) return; // Don't allow selection of coming soon modules
    
    setSelectedModules(prev => {
      const exists = prev.find(m => m.moduleId === moduleId);
      if (exists) {
        return prev.filter(m => m.moduleId !== moduleId);
      } else {
        // Directly select module without permission selection
        return [...prev, { moduleId }];
      }
    });
  };

  // Handle saving module assignments
  const handleSaveModules = () => {
    if (showModuleModal) {
      setUsers(users.map(u => 
        u.id === showModuleModal 
          ? { ...u, assignedModules: selectedModules }
          : u
      ));
      handleCloseModuleModal();
    }
  };

  // Handle removing a module from user
  const handleRemoveModule = (userId, module) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, assignedModules: u.assignedModules.filter(m => m !== module) }
        : u
    ));
  };

  // Show loading state (new loader with CubeLoader)
  if (isLoadingMembers) {
    return <SignInLoader text="Loading role management…" centerItems={adminHeaderLinks} />;
  }

  // Show error state
  if (membersError) {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
        <PageHeader centerItems={adminHeaderLinks} activePath={location.pathname} />
        <div className="flex-1 flex items-center justify-center px-4">
          <ErrorDisplay message={membersError} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background elements similar to homepage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#46cdc6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#46cdc6]/5 rounded-full blur-[100px]" />
      </div>

      {/* Tiles background pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("/background/tiles.png")',
          backgroundSize: '80px 80px',
          backgroundRepeat: 'repeat',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) brightness(1.2)',
        }}
      />

      {/* Header */}
      <PageHeader centerItems={adminHeaderLinks} activePath={location.pathname} />

      {/* SECTION 1: Hero Section */}
      <div className="px-8 pt-12 pb-8 relative z-10">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-40 right-40 w-96 h-96 bg-[#46CDCF]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-40 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto relative"
        >
          <div className="flex items-start justify-between mb-12">
            <div>
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#46CDCF]/10 to-amber-500/10 rounded-full mb-6 border border-[#46CDCF]/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="w-4 h-4 text-[#46CDCF]" />
                <span className="text-sm font-semibold text-[#46CDCF]">ROLE MANAGEMENT</span>
              </motion.div>
              <motion.h1 
                className="text-6xl font-bold text-slate-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Role Assignment
              </motion.h1>
              <motion.p 
                className="text-xl text-slate-600 max-w-3xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Assign roles to users to define their access and responsibilities. Each role grants a complete set of permissions.
              </motion.p>
            </div>
          </div>

          {/* Inline Stats */}
          <motion.div 
            className="flex items-center gap-4 mb-8 flex-nowrap overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-4xl font-bold bg-gradient-to-br from-amber-600 to-amber-400 bg-clip-text text-transparent">
                {stats['Super Admin']}
              </span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Crown className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium">Super Admins</span>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-200 flex-shrink-0" />

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {stats['Regular member']}
              </span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Regular Members</span>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-200 flex-shrink-0" />

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-4xl font-bold bg-gradient-to-br from-green-600 to-green-400 bg-clip-text text-transparent">
                {stats['Billing Contact']}
              </span>
              <div className="flex items-center gap-1.5 text-slate-600">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Billing Contacts</span>
              </div>
            </div>
          </motion.div>

          {/* Info Banner - Only show when there's only one Super Admin */}
          {superAdminCount <= 1 && (
            <motion.div 
              className="flex items-start gap-4 p-6 bg-amber-50 border border-amber-200 rounded-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">Super Admin Protection</h3>
                <p className="text-sm text-amber-700">
                  At least one Super Admin must exist in the system. The last Super Admin role cannot be removed or changed.
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* SECTION 2: Role Assignment Table */}
      <div className="px-4 sm:px-6 lg:px-12 xl:px-16 pb-12 relative z-10">
        <div className="max-w-[95%] xl:max-w-[1400px] mx-auto relative">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 overflow-x-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-8 px-10 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 relative z-10 overflow-visible">
              <div className="col-span-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">User</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Role</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assign Role</span>
              </div>
              <div className="col-span-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned pillars</span>
              </div>
              <div className="col-span-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Action</span>
              </div>
              <div className="col-span-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Billing Contact</span>
              </div>
            </div>

            {/* Role change error */}
            {roleChangeError && (
              <div className="mx-10 mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{roleChangeError}</span>
                <button
                  type="button"
                  onClick={() => setRoleChangeError(null)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Users List */}
            <div className="overflow-visible relative">
              {users.map((user, index) => {
                const isSuperAdmin = user.role === 'Super Admin';
                const isLastSuperAdmin = isSuperAdmin && superAdminCount <= 1;
                const RoleIcon = getRoleIcon(user.role);
                const roleColor = getRoleColor(user.role);

                return (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className={`
                      grid grid-cols-12 gap-8 px-10 py-6 border-b border-slate-100
                      hover:bg-slate-50/50 transition-all duration-200
                      ${isLastSuperAdmin ? 'bg-gradient-to-r from-amber-50/30 to-transparent' : ''}
                    `}
                  >
                    {/* User Info */}
                    <div className="col-span-3 flex items-center gap-4">
                      <div className={`
                        w-12 h-12 min-w-12 min-h-12 flex-shrink-0 rounded-xl inline-flex items-center justify-center text-white font-bold text-sm shadow-md
                        ${user.status === 'inactive'
                          ? 'bg-gradient-to-br from-slate-400 to-slate-600'
                          : 'bg-gradient-to-br from-[#46CDCF] to-[#15ae99]'
                        }
                      `}>
                        {(user.name || '').trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 3) || '?'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{user.name}</h3>
                          {isLastSuperAdmin && (
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 text-xs font-bold rounded-full border border-amber-500/20">
                              PROTECTED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600">{user.email}</p>
                      </div>
                    </div>

                    {/* Current Role Badge */}
                    <div className="col-span-2 flex items-center">
                      {user.role ? (
                        <div className={`
                          flex items-center gap-2 px-4 py-2 rounded-xl border-2
                          ${roleColor === 'amber' ? 'bg-amber-50 border-amber-200 text-amber-700' : ''}
                          ${roleColor === 'red' ? 'bg-red-50 border-red-200 text-red-700' : ''}
                          ${roleColor === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
                          ${roleColor === 'green' ? 'bg-green-50 border-green-200 text-green-700' : ''}
                          ${roleColor === 'cyan' ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : ''}
                          ${roleColor === 'slate' ? 'bg-slate-50 border-slate-200 text-slate-700' : ''}
                        `}>
                          <RoleIcon className="w-4 h-4" />
                          <span className="font-semibold text-sm">{user.role}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">View Only</span>
                      )}
                    </div>

                    {/* Role Selection Dropdown (disabled only for last remaining Super Admin) */}
                    <div className="col-span-2 flex items-center">
                      <DropdownMenu open={openRoleDropdown === user.id} onOpenChange={(open) => setOpenRoleDropdown(open ? user.id : null)}>
                        <DropdownMenuTrigger asChild>
                          <button
                            disabled={isLastSuperAdmin}
                            className={`
                              w-full px-4 py-3 border-2 border-slate-200 rounded-xl
                              focus:outline-none focus:ring-2 focus:ring-[#46CDCF] focus:border-transparent
                              font-medium text-slate-900 bg-white
                              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
                              hover:border-[#46CDCF] transition-colors
                              flex items-center justify-between
                            `}
                          >
                            <span className="flex items-center gap-2">
                              {user.role ? (
                                <>
                                  {(() => {
                                    const RoleIcon = getRoleIcon(user.role);
                                    return <RoleIcon className="w-4 h-4" />;
                                  })()}
                                  {user.role}
                                </>
                              ) : (
                                <>
                                  <UserCog className="w-4 h-4" />
                                  View Only
                                </>
                              )}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white border-2 border-slate-200 rounded-xl shadow-xl p-1">
                          {AVAILABLE_ROLES.map((role) => {
                            const RoleIcon = role.icon;
                            const isSelected = user.role === role.value;
                            return (
                              <DropdownMenuItem
                                key={role.value}
                                onClick={() => {
                                  handleRoleChange(user.id, role.value);
                                  setOpenRoleDropdown(null);
                                }}
                                className={`
                                  cursor-pointer px-4 py-3 rounded-lg transition-colors
                                  ${isSelected 
                                    ? 'bg-[#46CDCF]/10 text-[#46CDCF] font-semibold' 
                                    : 'text-slate-700 hover:bg-slate-50'
                                  }
                                `}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <RoleIcon className={`w-4 h-4 ${isSelected ? 'text-[#46CDCF]' : 'text-slate-500'}`} />
                                  <span className="flex-1">{role.label}</span>
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-[#46CDCF]" />
                                  )}
                                </div>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Assigned pillars (from API pillar_data) – truncated with tooltip for full name */}
                    <div className="col-span-3 flex items-center flex-wrap gap-2">
                      {user.assignedPillars && user.assignedPillars.length > 0 ? (
                        user.assignedPillars.map((pillarName, idx) => (
                          <PillarBadgeWithTooltip key={idx} name={pillarName} />
                        ))
                      ) : (
                        <span className="text-sm text-slate-400 italic">No pillars assigned</span>
                      )}
                    </div>

                    {/* Action - Three Dots Menu (none for Super Admin) */}
                    <div className="col-span-1 flex items-center justify-center">
                      {isSuperAdmin ? (
                        <span className="text-slate-400 text-sm">—</span>
                      ) : (
                        <DropdownMenu open={openActionMenu === user.id} onOpenChange={(open) => setOpenActionMenu(open ? user.id : null)}>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="w-5 h-5 text-slate-600" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white border-2 border-slate-200 rounded-xl shadow-xl p-1">
                            <DropdownMenuItem
                              onClick={() => {
                                handleOpenPillarModal(user.id);
                                setOpenActionMenu(null);
                              }}
                              className="cursor-pointer px-4 py-3 rounded-lg transition-colors text-slate-700 hover:bg-slate-50"
                            >
                              <div className="flex items-center gap-3 w-full">
                                <Database className="w-4 h-4 text-slate-500" />
                                <span className="flex-1">Assign Pillars</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenModuleModal(user.id)}
                              className="cursor-pointer px-4 py-3 rounded-lg transition-colors text-slate-700 hover:bg-slate-50"
                            >
                              <div className="flex items-center gap-3 w-full">
                                <Shield className="w-4 h-4 text-slate-500" />
                                <span className="flex-1">Assign Module</span>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {/* Billing Contact (checkbox: calls update role API with roles ± billing_admin) */}
                    <div className="col-span-1 flex items-center justify-center">
                      <Checkbox
                        checked={user.isBillingContact || false}
                        disabled={isSuperAdmin}
                        onCheckedChange={isSuperAdmin ? undefined : (checked) => {
                          handleBillingContactChange(user.id, !!checked);
                        }}
                        className="w-5 h-5 border-2 border-slate-300 data-[state=checked]:bg-[#46CDCF] data-[state=checked]:border-[#46CDCF] disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Role Descriptions */}
          <motion.div 
            className="mt-12 grid grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="p-6 bg-white rounded-2xl border border-amber-200 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Crown className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Super Admin</h3>
                  <p className="text-sm text-slate-600">
                    Full system access with all administrative privileges. Can manage all modules, users, and system settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-blue-200 shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Regular member</h3>
                  <p className="text-sm text-slate-600">
                    Standard team member with basic access to view and interact with assigned content.
                  </p>
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Pillar Assignment Modal */}
      <AnimatePresence>
        {showPillarModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClosePillarModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="min-w-0">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Assign Pillars</h3>
                  <p className="text-slate-600">
                    Select one or more pillars to assign to this user.
                  </p>
                </div>
                <button
                  onClick={handleClosePillarModal}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Pillars list from GET /organization/pillars */}
              <div className="flex-1 overflow-y-auto pr-2 mb-6">
                    {isLoadingPillars ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-[#46CDCF]/30 border-t-[#46CDCF] rounded-full animate-spin" />
                          <p className="text-sm text-slate-600">Loading pillars...</p>
                        </div>
                      </div>
                    ) : pillarsError ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3 text-center">
                          <AlertCircle className="w-8 h-8 text-amber-500" />
                          <p className="text-sm text-slate-600">{pillarsError}</p>
                        </div>
                      </div>
                    ) : availablePillars.length === 0 ? (
                      <div className="flex items-center justify-center py-12">
                        <p className="text-sm text-slate-600">No pillars available</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {availablePillars.map((pillar) => {
                          const pillarName = (typeof pillar === 'object' && pillar !== null)
                            ? (pillar.name || pillar.title || pillar.pillar_name || '')
                            : String(pillar);
                          const pillarId = pillar?.id ?? pillar?.pillar_id ?? pillarName;
                          const isSelected = selectedPillars.includes(pillarName);
                          return (
                            <button
                              key={pillarId}
                              type="button"
                              onClick={() => handleTogglePillar(pillarName)}
                              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                isSelected
                                  ? 'bg-[#46CDCF]/10 border-[#46CDCF] shadow-md'
                                  : 'bg-white border-slate-200 hover:border-[#46CDCF]/50 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <span className={`font-medium block ${isSelected ? 'text-[#46CDCF]' : 'text-slate-900'}`}>
                                    {pillarName}
                                  </span>
                                  {pillar.description && (
                                    <span className="text-xs text-slate-500 mt-1 block">
                                      {pillar.description}
                                    </span>
                                  )}
                                </div>
                                {isSelected && (
                                  <Check className="w-5 h-5 text-[#46CDCF] ml-3 flex-shrink-0" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {savePillarsError && (
                    <div className="mb-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-xl border border-red-200">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{savePillarsError}</span>
                    </div>
                  )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={handleClosePillarModal}
                  disabled={isSavingPillars}
                  className="px-6 py-2.5 rounded-xl border-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePillars}
                    disabled={isSavingPillars}
                    className="px-6 py-2.5 rounded-xl bg-[#46CDCF] hover:bg-[#15ae99] text-white shadow-lg shadow-[#46CDCF]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingPillars ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      'Save Pillars'
                    )}
                  </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module Assignment Modal */}
      <AnimatePresence>
        {showModuleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCloseModuleModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Assign Module</h3>
                  <p className="text-slate-600">Select one or more modules to assign to this user</p>
                </div>
                <button
                  onClick={handleCloseModuleModal}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Modules List */}
              <div className="flex-1 overflow-y-auto pr-2 mb-6">
                <div className="space-y-3">
                  {AVAILABLE_MODULES.map((module) => {
                    const isSelected = isModuleSelected(module.id);
                    
                    return (
                      <div key={module.id}>
                        <button
                          type="button"
                          onClick={() => handleToggleModule(module.id)}
                          disabled={module.comingSoon}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            module.comingSoon
                              ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-[#46CDCF]/10 border-[#46CDCF] shadow-md'
                              : 'bg-white border-slate-200 hover:border-[#46CDCF]/50 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className={`font-medium ${isSelected ? 'text-[#46CDCF]' : 'text-slate-900'}`}>
                                {module.name}
                              </span>
                              {module.comingSoon && (
                                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                                  Coming Soon
                                </span>
                              )}
                            </div>
                            {isSelected && !module.comingSoon && (
                              <Check className="w-5 h-5 text-[#46CDCF]" />
                            )}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCloseModuleModal}
                  className="px-6 py-2.5 rounded-xl border-2 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveModules}
                  className="px-6 py-2.5 rounded-xl bg-[#46CDCF] hover:bg-[#15ae99] text-white shadow-lg shadow-[#46CDCF]/20"
                >
                  Save Modules
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal Tooltip - Renders outside table container */}
      {hoveredTooltip && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${hoveredTooltip.x}px`,
            top: `${hoveredTooltip.y - 10}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="relative p-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)] w-72 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-indigo-400"
                >
                  <path
                    clipRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white">Assigned Pillars</h3>
            </div>

            <div className="space-y-2">
              <ul className="space-y-2">
                {hoveredTooltip.pillarNames.map((pillarName, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <svg 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0"
                    >
                      <path
                        clipRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                    <span className="break-words">{pillarName}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50"></div>

            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-r border-b border-white/10"></div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
