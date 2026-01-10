import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Lock, Sparkles, ChevronRight, ChevronDown, Crown, UserPlus, Plus, X, Check, AlertCircle, Database, Key, DollarSign, UserCog, MoreVertical } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';

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
  // Transform users data to include their current roles
  const getUsersWithRoles = () => {
    return ROLES_DATA.users.map(user => {
      // Find which role this user is assigned to
      const assignedRole = ROLES_DATA.roles.find(role => 
        role.assignedUsers.includes(user.id)
      );
      let roleName = assignedRole ? assignedRole.name : '';
      // Convert removed roles to "Regular member" since they're no longer in dropdown
      const removedRoles = ['Billing Contact', 'Module Assignment', 'Data Module', 'Security Module'];
      if (removedRoles.includes(roleName)) {
        roleName = 'Regular member';
      }
      return {
        ...user,
        role: roleName,
        status: 'active' // Default status
      };
    });
  };

  const [users, setUsers] = useState(getUsersWithRoles().map(user => ({
    ...user,
    assignedPillars: [], // Initialize with empty array for assigned pillars
    assignedModules: [] // Initialize with empty array for assigned modules
  })));
  const [roles, setRoles] = useState(ROLES_DATA.roles);
  const [showPillarModal, setShowPillarModal] = useState(null); // userId for which modal is open
  const [showModuleModal, setShowModuleModal] = useState(null); // userId for which module modal is open
  const [selectedPillars, setSelectedPillars] = useState([]); // Temporary selection in modal
  const [selectedModules, setSelectedModules] = useState([]); // Temporary selection in module modal
  const [openRoleDropdown, setOpenRoleDropdown] = useState(null); // userId for which role dropdown is open
  const [openActionMenu, setOpenActionMenu] = useState(null); // userId for which action menu is open

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

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    const user = users.find(u => u.id === userId);
    
    // Check if trying to remove Super Admin role from last Super Admin
    if (user?.role === 'Super Admin' && newRole !== 'Super Admin') {
      if (superAdminCount <= 1) {
        // You can add toast notification here if needed
        console.error('Cannot remove the last Super Admin role');
        return;
      }
    }

    // Update user's role
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));

    // Update roles data structure
    setRoles(roles.map(role => {
      // Remove user from old role
      if (role.assignedUsers.includes(userId)) {
        return { ...role, assignedUsers: role.assignedUsers.filter(id => id !== userId) };
      }
      // Add user to new role
      if (newRole && role.name === newRole) {
        return { ...role, assignedUsers: [...role.assignedUsers, userId] };
      }
      return role;
    }));
  };

  // Handle opening pillar assignment modal
  const handleOpenPillarModal = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedPillars(user?.assignedPillars || []);
    setShowPillarModal(userId);
  };

  // Handle closing pillar assignment modal
  const handleClosePillarModal = () => {
    setShowPillarModal(null);
    setSelectedPillars([]);
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
  const handleSavePillars = () => {
    if (showPillarModal) {
      setUsers(users.map(u => 
        u.id === showPillarModal 
          ? { ...u, assignedPillars: selectedPillars }
          : u
      ));
      handleClosePillarModal();
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
      <PageHeader />

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
        <div className="max-w-[95%] xl:max-w-[1400px] mx-auto">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 overflow-hidden shadow-2xl shadow-slate-200/50">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-8 px-10 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
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
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Pillars</span>
              </div>
              <div className="col-span-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Action</span>
              </div>
              <div className="col-span-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Billing Contact</span>
              </div>
            </div>

            {/* Users List */}
            <div>
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
                        w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md
                        ${user.status === 'inactive'
                          ? 'bg-gradient-to-br from-slate-400 to-slate-600'
                          : 'bg-gradient-to-br from-[#46CDCF] to-[#15ae99]'
                        }
                      `}>
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
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

                    {/* Role Selection Dropdown */}
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

                    {/* Assigned Pillars */}
                    <div className="col-span-3 flex items-center flex-wrap gap-2">
                      {user.assignedPillars && user.assignedPillars.length > 0 ? (
                        user.assignedPillars.map((pillar) => (
                          <div
                            key={pillar}
                            className="group flex items-center gap-1.5 px-3 py-1.5 bg-[#46CDCF]/10 border border-[#46CDCF]/30 rounded-lg text-sm text-[#46CDCF] font-medium hover:bg-[#46CDCF]/20 transition-colors cursor-pointer"
                            onClick={() => handleRemovePillar(user.id, pillar)}
                          >
                            <span>{pillar}</span>
                            <X className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-slate-400 italic">No pillars assigned</span>
                      )}
                    </div>

                    {/* Action - Three Dots Menu */}
                    <div className="col-span-1 flex items-center justify-center">
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
                    </div>

                    {/* Billing Contact Checkbox */}
                    <div className="col-span-1 flex items-center justify-center">
                      <Checkbox
                        checked={user.isBillingContact || false}
                        onCheckedChange={(checked) => {
                          setUsers(users.map(u => 
                            u.id === user.id ? { ...u, isBillingContact: checked } : u
                          ));
                        }}
                        className="w-5 h-5 border-2 border-slate-300 data-[state=checked]:bg-[#46CDCF] data-[state=checked]:border-[#46CDCF]"
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
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Assign Pillars</h3>
                  <p className="text-slate-600">Select one or more pillars to assign to this user</p>
                </div>
                <button
                  onClick={handleClosePillarModal}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Pillars List */}
              <div className="flex-1 overflow-y-auto pr-2 mb-6">
                <div className="space-y-2">
                  {AVAILABLE_PILLARS.map((pillar) => {
                    const isSelected = selectedPillars.includes(pillar);
                    return (
                      <button
                        key={pillar}
                        type="button"
                        onClick={() => handleTogglePillar(pillar)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'bg-[#46CDCF]/10 border-[#46CDCF] shadow-md'
                            : 'bg-white border-slate-200 hover:border-[#46CDCF]/50 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium ${isSelected ? 'text-[#46CDCF]' : 'text-slate-900'}`}>
                            {pillar}
                          </span>
                          {isSelected && (
                            <Check className="w-5 h-5 text-[#46CDCF]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleClosePillarModal}
                  className="px-6 py-2.5 rounded-xl border-2 text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePillars}
                  className="px-6 py-2.5 rounded-xl bg-[#46CDCF] hover:bg-[#15ae99] text-white shadow-lg shadow-[#46CDCF]/20"
                >
                  Save Pillars
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
    </div>
  );
}
