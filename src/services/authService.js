/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

import api from './api';
import { getErrorMessage } from './errorHandler';

/**
 * Sign in user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email (or username)
 * @param {string} credentials.password - User password
 * @param {string} [credentials.device_info] - Device information (optional)
 */
export const signIn = async (credentials) => {
  try {
    const response = await api.post('/auth/signin', credentials);
    
    // Store full user data in sessionStorage (includes maturity_model_id, maturity_model_name, ongoing_assessment_id, etc.)
    if (response.data) {
      sessionStorage.setItem('currentUser', JSON.stringify(response.data));
      sessionStorage.setItem('isAuthenticated', 'true');
    }
    
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Sign up new user
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.full_name - User full name
 * @param {string} userData.user_name - Username
 * @param {string} userData.organization_name - Organization name
 * @param {string} userData.tos_accepted - Terms of service acceptance ("true" or "false")
 * @param {string} userData.device_info - Device information
 */
export const signUp = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
    
    // Store token if present in response
    if (response.data?.token) {
      const currentUser = {
        ...response.data,
        token: response.data.token,
      };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      localStorage.setItem('isAuthenticated', 'true');
    }
    
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Sign out user
 */
export const signOut = async () => {
  try {
    await api.post('/auth/signout');
    return {
      success: true,
    };
  } catch (error) {
    // Even if API call fails, we should clear local storage
    return {
      success: true, // Return success to allow local cleanup
    };
  }
};

/**
 * Refresh authentication token
 */
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Change password
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.post('/auth/change-password', passwordData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Get Terms of Service
 */
export const getTermsOfService = async () => {
  try {
    const response = await api.get('/user/tos');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

