import { usePermissionStore } from '../stores/permissionStore';

/**
 * Hook to check user permissions
 * @returns {Object} Permission checking utilities
 */
export function usePermission() {
  const checkPermission = usePermissionStore((state) => state.checkPermission);
  const checkAnyPermission = usePermissionStore((state) => state.checkAnyPermission);
  const checkAllPermissions = usePermissionStore((state) => state.checkAllPermissions);
  const getUserPermissions = usePermissionStore((state) => state.getUserPermissions);
  
  return {
    // Check if user has a specific permission
    hasPermission: checkPermission,
    
    // Check if user has any of the specified permissions
    hasAnyPermission: checkAnyPermission,
    
    // Check if user has all of the specified permissions
    hasAllPermissions: checkAllPermissions,
    
    // Get all permissions for current user
    getPermissions: getUserPermissions,
  };
}











