import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ROLES } from '../constants/roles';
import usersConfig from '../config/users.json';
import { signIn as signInAPI } from '../services/authService';

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
        // currentUser from sign-in API includes: id, email, full_name, organization_id,
        // maturity_model_id, maturity_model_name, ongoing_assessment_id, token, is_super_admin, is_billing_admin, etc.
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
        
        signIn: async (email, password) => {
          try {
            set({ isLoading: true });
            
            // Call API signin
            const result = await signInAPI({ email, password });
            
            if (result.success) {
              // User data is automatically stored in sessionStorage by authService
              // Extract full user data from response
              const userData = result.data || {};
              
              // Store in Zustand state
              set({
                currentUser: userData,
                isAuthenticated: true,
                isLoading: false,
              });
              
              return { success: true, data: result.data };
            } else {
              set({ isLoading: false });
              return { success: false, error: result.error || "Sign in failed" };
            }
          } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message || "An error occurred during sign in" };
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
        
        // Update ongoing_assessment_ids (onboarding assessment ID) when starting a new assessment
        // Handles both old single value format and new array format
        updateOngoingAssessmentId: (assessmentId) => {
          const currentUser = get().currentUser;
          if (currentUser) {
            // Get existing ongoing_assessment_ids array or create from single value
            const existingIds = currentUser?.ongoing_assessment_ids || 
                               (currentUser?.ongoing_assessment_id ? [currentUser.ongoing_assessment_id] : []);
            
            // Add new assessment ID if not already present
            const updatedIds = existingIds.includes(assessmentId) 
              ? existingIds 
              : [...existingIds, assessmentId];
            
            const updatedUser = {
              ...currentUser,
              ongoing_assessment_ids: updatedIds,
              // Keep backward compatibility with single value
              ongoing_assessment_id: updatedIds[0] || null,
            };
            
            // Update Zustand state
            set({
              currentUser: updatedUser,
            });
            
            // Update sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        },
        
        // Helper: Get user role
        getUserRole: () => {
          const user = get().currentUser;
          return user?.role || null;
        },
        
        // Helper: Check if user is Super Admin
        isSuperAdmin: () => {
          const user = get().currentUser;
          // Check API response field first, then fallback to role
          return user?.is_super_admin === true || user?.role === ROLES.SUPER_ADMIN;
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
        // After rehydration, check sessionStorage for user data
        if (state) {
          try {
            const sessionUser = sessionStorage.getItem('currentUser');
            const sessionAuth = sessionStorage.getItem('isAuthenticated');
            
            // If sessionStorage has user data, use it (takes precedence)
            if (sessionUser && sessionAuth === 'true') {
              const userData = JSON.parse(sessionUser);
              state.currentUser = userData;
              state.isAuthenticated = true;
            }
          } catch (error) {
            console.error('Error reading sessionStorage:', error);
          }
          
          state.isLoading = false;
        }
      },
    }
  )
);

