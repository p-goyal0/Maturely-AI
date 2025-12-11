import { useRole } from '../../hooks/useRole';
import { ROLES } from '../../constants/roles';

/**
 * RoleGuard Component
 * Conditionally renders children based on user role
 * 
 * @param {string|string[]} allowedRoles - Single role or array of roles that can access
 * @param {React.ReactNode} children - Content to render if user has required role
 * @param {React.ReactNode} fallback - Content to render if user doesn't have required role
 * @param {boolean} requireAll - If true, user must have all roles (when array provided)
 */
export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = null,
  requireAll = false 
}) {
  const { role, hasRole } = useRole();
  
  if (!role) {
    return fallback;
  }
  
  // Normalize to array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  // Check access
  let hasAccess = false;
  if (requireAll) {
    hasAccess = roles.every(r => hasRole(r));
  } else {
    hasAccess = roles.some(r => hasRole(r));
  }
  
  return hasAccess ? children : fallback;
}

/**
 * SuperAdminGuard - Only allows Super Admin
 */
export function SuperAdminGuard({ children, fallback = null }) {
  return (
    <RoleGuard allowedRoles={ROLES.SUPER_ADMIN} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

/**
 * ModuleOwnerGuard - Only allows Module Owner or higher
 */
export function ModuleOwnerGuard({ children, fallback = null }) {
  const { hasRoleLevel } = useRole();
  const { ROLES } = require('../../constants/roles');
  
  return hasRoleLevel(ROLES.MODULE_OWNER) ? children : fallback;
}

/**
 * BillingContactGuard - Only allows Billing Contact or higher
 */
export function BillingContactGuard({ children, fallback = null }) {
  const { hasRoleLevel } = useRole();
  const { ROLES } = require('../../constants/roles');
  
  return hasRoleLevel(ROLES.BILLING_CONTACT) ? children : fallback;
}

