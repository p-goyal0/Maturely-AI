import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ROLES } from '../constants/roles';

/**
 * Auth Store using Zustand
 * Manages authentication state and user information
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      isAuthenticated: false,
      currentUser: null,
      isLoading: true,
      
      // Actions
      setUser: (user) => {
        set({
          currentUser: user,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },
      
      signIn: (user) => {
        set({
          currentUser: user,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      
      signOut: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      // Helper: Get user role
      getUserRole: () => {
        const user = get().currentUser;
        return user?.role || null;
      },
      
      // Helper: Check if user is Super Admin
      isSuperAdmin: () => {
        const role = get().getUserRole();
        return role === ROLES.SUPER_ADMIN;
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
      }),
    }
  )
);

