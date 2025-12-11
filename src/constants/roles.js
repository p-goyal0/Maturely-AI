/**
 * Role Constants
 * Defines all available roles in the system
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  MODULE_OWNER: 'MODULE_OWNER',
  BILLING_CONTACT: 'BILLING_CONTACT',
};

/**
 * Role Labels for Display
 */
export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.MODULE_OWNER]: 'Module Owner',
  [ROLES.BILLING_CONTACT]: 'Billing Contact',
};

/**
 * Role Hierarchy (higher number = more permissions)
 */
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 3,
  [ROLES.MODULE_OWNER]: 2,
  [ROLES.BILLING_CONTACT]: 1,
};

/**
 * Check if a role has at least the required level
 */
export const hasRoleLevel = (userRole, requiredRole) => {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
};


