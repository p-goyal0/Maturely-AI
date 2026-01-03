import { useAuthStore } from '../stores/authStore';
import { ROLES, hasRoleLevel } from '../constants/roles';

/**
 * Hook to check user roles
 * @returns {Object} Role checking utilities
 */
export function useRole() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const userRole = currentUser?.role || null;
  
  return {
    // Current user's role
    role: userRole,
    
    // Check if user has a specific role
    hasRole: (role) => userRole === role,
    
    // Check if user has at least the required role level
    hasRoleLevel: (requiredRole) => hasRoleLevel(userRole, requiredRole),
    
    // Check if user is Super Admin
    isSuperAdmin: userRole === ROLES.SUPER_ADMIN,
    
    // Check if user is Module Owner
    isModuleOwner: userRole === ROLES.MODULE_OWNER,
    
    // Check if user is Billing Contact
    isBillingContact: userRole === ROLES.BILLING_CONTACT,
    
    // Get role label for display
    getRoleLabel: () => {
      const { ROLE_LABELS } = require('../constants/roles');
      return ROLE_LABELS[userRole] || 'Unknown';
    },
  };
}











