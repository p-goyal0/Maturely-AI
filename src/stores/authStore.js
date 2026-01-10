import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ROLES } from '../constants/roles';
import usersConfig from '../config/users.json';

// Get initial users from config file
const initialUsers = usersConfig.users || [];

/**
 * Auth Store using Zustand
 * Manages authentication state and user information
 */
export const useAuthStore = create(
  persist(
    (set, get) => {
      // Initialize users from config and localStorage
      const initializeUsers = () => {
        const savedUsers = localStorage.getItem("registeredUsers");
        let localUsers = [];
        
        if (savedUsers) {
          try {
            localUsers = JSON.parse(savedUsers);
          } catch (e) {
            localUsers = [];
          }
        }
        
        // Merge initial users from JSON with locally registered users
        const allUsers = [...initialUsers];
        localUsers.forEach(localUser => {
          if (!allUsers.find(user => user.username === localUser.username)) {
            allUsers.push(localUser);
          }
        });
        
        return allUsers;
      };
      
      return {
        // State
        isAuthenticated: false,
        currentUser: null,
        isLoading: true,
        users: initializeUsers(),
        
        // Actions
        setUser: (user) => {
          set({
            currentUser: user,
            isAuthenticated: !!user,
            isLoading: false,
          });
        },
        
        signIn: (username, password) => {
          const users = get().users;
          const user = users.find(
            (u) => u.username === username && u.password === password
          );

          if (user) {
            const userData = { username: user.username, role: user.role };
            set({
              currentUser: userData,
              isAuthenticated: true,
              isLoading: false,
            });
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("currentUser", JSON.stringify(userData));
            return { success: true };
          } else {
            return { success: false, error: "Invalid username or password" };
          }
        },
        
        signUp: (username, password) => {
          const users = get().users;
          const userExists = users.find((u) => u.username === username);
          
          if (userExists) {
            return { success: false, error: "Username already exists" };
          }

          // Add new user
          const newUser = { username, password, registeredAt: new Date().toISOString() };
          const updatedUsers = [...users, newUser];
          set({ users: updatedUsers });

          // Save only newly registered users to localStorage
          const newUsers = updatedUsers.filter(user => 
            !initialUsers.find(initialUser => initialUser.username === user.username)
          );
          localStorage.setItem("registeredUsers", JSON.stringify(newUsers));

          // Auto sign in after sign up
          const userData = { username };
          set({
            currentUser: userData,
            isAuthenticated: true,
            isLoading: false,
          });
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("currentUser", JSON.stringify(userData));
          
          return { success: true };
        },
        
        signOut: () => {
          // Clear localStorage
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("currentUser");
          // Update state
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
      };
    },
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentUser: state.currentUser,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration, set loading to false
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);

