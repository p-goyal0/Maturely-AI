import { usePermission } from '../../hooks/usePermission';

/**
 * PermissionGuard Component
 * Conditionally renders children based on user permissions
 * 
 * @param {string|string[]} requiredPermissions - Single permission or array of permissions
 * @param {React.ReactNode} children - Content to render if user has required permission(s)
 * @param {React.ReactNode} fallback - Content to render if user doesn't have required permission(s)
 * @param {boolean} requireAll - If true, user must have all permissions (when array provided)
 */
export function PermissionGuard({ 
  requiredPermissions, 
  children, 
  fallback = null,
  requireAll = false 
}) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
  
  // Normalize to array
  const permissions = Array.isArray(requiredPermissions) 
    ? requiredPermissions 
    : [requiredPermissions];
  
  // Check access
  let hasAccess = false;
  if (permissions.length === 1) {
    hasAccess = hasPermission(permissions[0]);
  } else if (requireAll) {
    hasAccess = hasAllPermissions(permissions);
  } else {
    hasAccess = hasAnyPermission(permissions);
  }
  
  return hasAccess ? children : fallback;
}











