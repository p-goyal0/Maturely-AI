import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { hasPermission, hasAnyPermission, hasAllPermissions, ROLE_PERMISSIONS } from '../constants/permissions';

/**
 * Permission Store using Zustand
 * Provides reactive permission checking based on current user's role
 */
export const usePermissionStore = create((set, get) => ({
  // Check if current user has a specific permission
  checkPermission: (permission) => {
    const role = useAuthStore.getState().getUserRole();
    return hasPermission(role, permission);
  },
  
  // Check if current user has any of the specified permissions
  checkAnyPermission: (permissions) => {
    const role = useAuthStore.getState().getUserRole();
    return hasAnyPermission(role, permissions);
  },
  
  // Check if current user has all of the specified permissions
  checkAllPermissions: (permissions) => {
    const role = useAuthStore.getState().getUserRole();
    return hasAllPermissions(role, permissions);
  },
  
  // Get all permissions for current user
  getUserPermissions: () => {
    const role = useAuthStore.getState().getUserRole();
    if (!role) return [];
    return ROLE_PERMISSIONS[role] || [];
  },
}));

