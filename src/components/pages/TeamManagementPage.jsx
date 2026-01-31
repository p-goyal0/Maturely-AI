import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Mail, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search,
  Sparkles,
  Shield,
  X,
  Trash2,
  Power,
  AlertCircle
} from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { inviteOrganizationMember } from '../../services/teamService';
import { getOrganizationMembers } from '../../services/roleService';
import { useAuthStore } from '../../stores/authStore';
import { SignInLoader } from '../shared/SignInLoader';
import { ErrorDisplay } from '../shared/ErrorDisplay';
import { Alert } from 'antd';

const adminHeaderLinks = [
  { label: 'Home', path: '/offerings' },
  { label: 'Settings', path: '/settings' },
];

export function TeamManagementPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccessMessage, setInviteSuccessMessage] = useState(null); // Show antd Alert when set

  // Fetch organization users (same API as Role Management page)
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
          const transformed = (result.data || []).map((member) => ({
            id: member.user_id,
            name: member.full_name || member.email || '',
            email: member.email,
            role: member.IsSuperAdmin === true ? 'Super Admin' : '',
            status: member.status || 'active',
          }));
          setTeamMembers(transformed);
        } else {
          setMembersError(result.error || 'Failed to load team members');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setMembersError('An unexpected error occurred while loading team members');
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [currentUser?.organization_id]);

  const handleResendInvite = (userId) => {
    // In a real app, this would call an API
    console.log('Resending invite to:', userId);
    alert('Invitation resent successfully!');
  };

  const handleRemoveMember = (userId) => {
    const member = teamMembers.find(m => m.id === userId);
    if (member?.role === 'Super Admin') {
      alert('Cannot remove Super Admin members');
      return;
    }
    setTeamMembers(teamMembers.filter(m => m.id !== userId));
    alert('Team member removed successfully');
  };

  const handleInviteUser = (userId) => {
    const member = teamMembers.find(m => m.id === userId);
    if (member) {
      setInviteEmail(member.email);
      setShowInviteModal(true);
    }
  };

  const handleDeactivateUser = (userId) => {
    const member = teamMembers.find(m => m.id === userId);
    if (member?.role === 'Super Admin') {
      alert('Cannot deactivate Super Admin members');
      return;
    }
    setTeamMembers(teamMembers.map(m => 
      m.id === userId ? { ...m, status: 'inactive' } : m
    ));
    alert('User deactivated successfully');
  };

  const handleSendInvite = async () => {
    if (!inviteEmail) {
      setInviteError('Please enter an email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setInviteError('Please enter a valid email address');
      return;
    }

    if (!currentUser?.organization_id) {
      setInviteError('Organization ID not found');
      return;
    }

    setIsSendingInvite(true);
    setInviteError('');

    try {
      const result = await inviteOrganizationMember(currentUser.organization_id, inviteEmail, 'regular_member', []);
      
      if (result.success) {
        setShowInviteModal(false);
        setInviteEmail('');
        setInviteError('');
        setInviteSuccessMessage('User successfully invited');
        // Refetch list so new user appears with status from API
        const refetch = await getOrganizationMembers(currentUser.organization_id);
        if (refetch.success && refetch.data) {
          const transformed = (refetch.data || []).map((member) => ({
            id: member.user_id,
            name: member.full_name || member.email || '',
            email: member.email,
            role: member.IsSuperAdmin === true ? 'Super Admin' : '',
            status: member.status || 'active',
          }));
          setTeamMembers(transformed);
        }
      } else {
        setInviteError(result.error || 'Failed to send invitation. Please try again.');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      setInviteError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSendingInvite(false);
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const name = (member.name || '').toLowerCase();
    const email = (member.email || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = name.includes(q) || email.includes(q);
    const statusNorm = (member.status || '').toLowerCase();
    const filterNorm = filterStatus ? filterStatus.toLowerCase() : null;
    const matchesFilter = !filterNorm || statusNorm === filterNorm || (filterNorm === 'pending' && statusNorm === 'invited');
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'active':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active
          </div>
        );
      case 'pending':
      case 'invited':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            {s === 'invited' ? 'Invited' : 'Pending'}
          </div>
        );
      case 'inactive':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-xs font-semibold border border-gray-200">
            <XCircle className="w-3.5 h-3.5" />
            Inactive
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">
            {status || '—'}
          </div>
        );
    }
  };

  const getRoleEmoji = (role) => {
    if (role === 'Super Admin') return '👑';
    if (role === 'Module Assignment') return '📊';
    if (role === 'Data Module') return '💾';
    if (role === 'Security Module') return '🔒';
    if (role === 'Billing Contact') return '💳';
    return '👤';
  };

  const activeCount = teamMembers.filter(m => (m.status || '').toLowerCase() === 'active').length;
  const pendingCount = teamMembers.filter(m => ['pending', 'invited'].includes((m.status || '').toLowerCase())).length;

  // Show loading state (new loader with CubeLoader)
  if (isLoadingMembers) {
    return <SignInLoader text="Loading user administration…" centerItems={adminHeaderLinks} />;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
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

      {membersError ? (
        <div className="flex-1 flex items-center justify-center px-4 relative z-10">
          <ErrorDisplay message={membersError} />
        </div>
      ) : (
      <>
      {/* SECTION 1: Hero Section */}
      <section className="pt-36 pb-32 relative z-10">
        {/* Non-uniform Gradient Overlay System - More Varied */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {/* Extended gradient background to remove sharp edges */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(223, 246, 248, 0.15) 20%, rgba(223, 246, 248, 0.25) 40%, rgba(255, 255, 255, 0.3) 60%, rgba(255, 255, 255, 0.6) 80%, rgba(255, 255, 255, 0.9) 100%)',
              zIndex: 2
            }}
          />
          {/* Irregular teal/cyan gradient overlay with varied opacity */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-full lg:w-[65%]"
            style={{
              background: `
                linear-gradient(135deg, transparent 0%, rgba(175, 232, 221, 0.08) 15%, rgba(223, 246, 248, 0.25) 35%, rgba(194, 252, 232, 0.18) 48%, rgba(253, 255, 255, 0.12) 65%, transparent 85%, transparent 100%),
                radial-gradient(ellipse 1200px 400px at 25% 60%, rgba(223, 239, 241, 0.3) 0%, rgba(184, 245, 232, 0.15) 40%, transparent 70%),
                radial-gradient(ellipse 800px 600px at 5% 30%, rgba(227, 237, 246, 0.2) 0%, rgba(165, 243, 252, 0.1) 35%, transparent 65%),
                linear-gradient(45deg, rgba(162, 197, 201, 0.15) 0%, transparent 25%, rgba(171, 244, 229, 0.12) 50%, transparent 75%)
              `,
            }}
          />
          {/* Scattered gradient spots on top right */}
          <div 
            className="absolute right-0 top-0 w-full lg:w-[45%] h-[60%]"
            style={{
              background: `
                radial-gradient(ellipse 300px 200px at 75% 20%, rgba(165, 243, 252, 0.2) 0%, transparent 60%),
                radial-gradient(ellipse 600px 300px at 90% 10%, rgba(153, 246, 228, 0.15) 0%, rgba(236, 254, 255, 0.08) 40%, transparent 65%),
                radial-gradient(ellipse 200px 400px at 85% 45%, rgba(194, 252, 232, 0.1) 0%, transparent 50%)
              `,
            }}
          />
          {/* Additional organic spots */}
          <div 
            className="absolute left-[20%] bottom-[20%] w-[40%] h-[30%]"
            style={{
              background: `
                radial-gradient(ellipse 400px 200px at 50% 50%, rgba(223, 246, 248, 0.12) 0%, transparent 70%)
              `,
            }}
          />
        </div>
        
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="relative max-w-7xl mx-auto">
            <div className="flex items-start justify-between mb-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.6 }}
                className="space-y-3 lg:space-y-4 relative z-20 text-center lg:text-left flex-1"
              >
                {/* Small Badge */}
                <div className="inline-block">
                  <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full text-xs font-medium border border-gray-200 shadow-sm">
                    ✨ TEAM MANAGEMENT
                  </div>
                </div>
                
                {/* Large Title */}
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                    Your Team
                  </h1>
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
                  Invite and manage team members, assign roles, and track engagement across your organization.
                </p>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 lg:gap-8 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                  {teamMembers.length}
                </span>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-800" />
                  <span className="text-base font-semibold text-slate-800">Total Members</span>
                </div>
              </div>

              <div className="w-px h-8 bg-slate-300" />

              <div className="flex items-center gap-2.5">
                <span className="text-3xl sm:text-4xl font-bold text-green-700">
                  {activeCount}
                </span>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-700" />
                  <span className="text-base font-semibold text-slate-800">Active</span>
                </div>
              </div>

              <div className="w-px h-8 bg-slate-300" />

              <div className="flex items-center gap-2.5">
                <span className="text-3xl sm:text-4xl font-bold text-amber-700">
                  {pendingCount}
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-700" />
                  <span className="text-base font-semibold text-slate-800">Pending</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Team List */}
      <main className="relative z-10 -mt-16">
        {/* Fade in gradient at top for smooth transition */}
        <div 
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.7) 30%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0.1) 90%, transparent 100%)',
            zIndex: 1
          }}
        />
        <div className="px-8 pt-20 pb-12 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Success message after inviting user (antd Alert) */}
            {inviteSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert
                  type="success"
                  message={inviteSuccessMessage}
                  closable
                  onClose={() => setInviteSuccessMessage(null)}
                  showIcon
                />
              </motion.div>
            )}

            {/* Search & Filter Bar */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-6 items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46CDCF] focus:border-transparent shadow-sm text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Status Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus(null)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterStatus === null
                      ? 'bg-[#46CDCF] text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-[#46CDCF]'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterStatus === 'active'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-green-600'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterStatus === 'pending'
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-600'
                  }`}
                >
                  Pending
                </button>
              </div>

              {/* Invite Button */}
              <Button
                onClick={() => setShowInviteModal(true)}
                className="bg-[#46CDCF] hover:bg-[#15ae99] text-white h-12 px-6 rounded-xl shadow-lg shadow-[#46CDCF]/20 hover:shadow-xl hover:shadow-[#46CDCF]/30 transition-all whitespace-nowrap"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Invite Member
              </Button>
            </motion.div>

            {/* Members Grid - Table Style */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 overflow-hidden shadow-2xl shadow-slate-200/50">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-6 px-8 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                <div className="col-span-5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team Member</span>
                </div>
                {/* <div className="col-span-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</span>
                </div> */}
                <div className="col-span-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
                </div>
                <div className="col-span-5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</span>
                </div>
              </div>

              {/* Members List */}
              <div>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member, index) => {
                    const isSuperAdmin = member.role === 'Super Admin';
                    return (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.05 }}
                        className={`
                          grid grid-cols-12 gap-6 px-8 py-6 border-b border-slate-100
                          hover:bg-slate-50/50 transition-all duration-200
                          ${isSuperAdmin ? 'bg-gradient-to-r from-amber-50/20 to-transparent' : ''}
                        `}
                      >
                        {/* Member Info */}
                        <div className="col-span-5 flex items-center gap-4">
                          <div className={`
                            w-12 h-12 min-w-12 min-h-12 flex-shrink-0 rounded-xl inline-flex items-center justify-center text-white font-bold text-sm shadow-md
                            ${isSuperAdmin
                              ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                              : 'bg-gradient-to-br from-[#46CDCF] to-[#15ae99]'
                            }
                          `}>
                            {(member.name || member.email || '?').trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 3) || '?'}
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900">{member.name || member.email || '—'}</h3>
                            <p className="text-sm text-slate-600">{member.email}</p>
                          </div>
                        </div>

                        {/* Role */}
                        {/* <div className="col-span-3 flex items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{getRoleEmoji(member.role)}</span>
                            <span className="font-medium text-slate-900">{member.role}</span>
                            {isSuperAdmin && (
                              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 text-xs font-bold rounded-full border border-amber-500/20">
                                PROTECTED
                              </span>
                            )}
                          </div>
                        </div> */}

                        {/* Status */}
                        <div className="col-span-2 flex items-center">
                          {getStatusBadge(member.status)}
                        </div>

                        {/* Actions: active → Remove, Block only; invited → Resend only */}
                        <div className="col-span-5 flex items-center gap-2">
                          {(() => {
                            const statusNorm = (member.status || '').toLowerCase();
                            const isInvited = statusNorm === 'invited' || statusNorm === 'pending';
                            const isActive = statusNorm === 'active';

                            if (isInvited) {
                              return (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResendInvite(member.id)}
                                  className="rounded-xl border-slate-200 text-slate-700 bg-white hover:border-[#46CDCF] hover:bg-[#46CDCF]/5 hover:text-[#46CDCF]"
                                >
                                  <Mail className="w-4 h-4 mr-2" />
                                  Resend
                                </Button>
                              );
                            }
                            if (isActive && !isSuperAdmin) {
                              return (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeactivateUser(member.id)}
                                    className="rounded-xl border-slate-200 text-slate-700 bg-white hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                  >
                                    <Power className="w-4 h-4 mr-2" />
                                    Block
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="rounded-xl border-slate-200 text-slate-700 bg-white hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Remove
                                  </Button>
                                </>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="px-8 py-16 text-center">
                    <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No team members found</p>
                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      </>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Invite Team Member</h3>
                  <p className="text-slate-600">Send an invitation to join your team</p>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold text-slate-900 mb-3">Email Address</label>
                  <input
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => {
                      setInviteEmail(e.target.value);
                      setInviteError(''); // Clear error when user types
                    }}
                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46CDCF] focus:border-transparent text-slate-900 placeholder:text-slate-400"
                  />
                  {inviteError && (
                    <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{inviteError}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                    setInviteError('');
                  }}
                  disabled={isSendingInvite}
                  className="flex-1 h-14 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendInvite}
                  disabled={isSendingInvite}
                  className="flex-1 h-14 rounded-xl bg-[#46CDCF] hover:bg-[#15ae99] text-white shadow-lg shadow-[#46CDCF]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSendingInvite ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send Invite'
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



