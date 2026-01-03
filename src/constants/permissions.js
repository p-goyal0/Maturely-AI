import { ROLES } from './roles';

/**
 * Permission Constants
 * Defines all available permissions in the system
 */
export const PERMISSIONS = {
  // Assessment Permissions
  ASSESSMENT_VIEW_ALL: 'ASSESSMENT_VIEW_ALL',
  ASSESSMENT_EDIT_ALL: 'ASSESSMENT_EDIT_ALL',
  ASSESSMENT_ASSIGN_ROLES: 'ASSESSMENT_ASSIGN_ROLES',
  ASSESSMENT_VIEW_ASSIGNED: 'ASSESSMENT_VIEW_ASSIGNED',
  ASSESSMENT_EDIT_ASSIGNED: 'ASSESSMENT_EDIT_ASSIGNED',
  
  // User Management
  USER_VIEW_ALL: 'USER_VIEW_ALL',
  USER_CREATE: 'USER_CREATE',
  USER_EDIT: 'USER_EDIT',
  USER_DELETE: 'USER_DELETE',
  USER_ASSIGN_ROLES: 'USER_ASSIGN_ROLES',
  
  // Billing
  BILLING_VIEW: 'BILLING_VIEW',
  BILLING_EDIT: 'BILLING_EDIT',
  BILLING_MANAGE: 'BILLING_MANAGE',
  
  // Settings
  SETTINGS_VIEW: 'SETTINGS_VIEW',
  SETTINGS_EDIT: 'SETTINGS_EDIT',
  SETTINGS_MANAGE: 'SETTINGS_MANAGE',
};

/**
 * Role-Permission Mapping
 * Defines which permissions each role has
 */
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // Super Admin has all permissions
    ...Object.values(PERMISSIONS),
  ],
  
  [ROLES.MODULE_OWNER]: [
    // Assessment permissions
    PERMISSIONS.ASSESSMENT_VIEW_ASSIGNED,
    PERMISSIONS.ASSESSMENT_EDIT_ASSIGNED,
    PERMISSIONS.ASSESSMENT_VIEW_ALL, // Can view but not edit all
    
    // Limited user management
    PERMISSIONS.USER_VIEW_ALL,
    
    // Settings
    PERMISSIONS.SETTINGS_VIEW,
  ],
  
  [ROLES.BILLING_CONTACT]: [
    // Billing only
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.BILLING_EDIT,
    
    // Can view assigned assessments (read-only)
    PERMISSIONS.ASSESSMENT_VIEW_ASSIGNED,
  ],
};

/**
 * Check if a role has a specific permission
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const rolePerms = ROLE_PERMISSIONS[role] || [];
  return rolePerms.includes(permission);
};

/**
 * Check if a role has any of the specified permissions
 */
export const hasAnyPermission = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 */
export const hasAllPermissions = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.every(permission => hasPermission(role, permission));
};











