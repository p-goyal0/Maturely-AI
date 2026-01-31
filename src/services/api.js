/**
 * Centralized API Client
 * Handles all HTTP requests with interceptors, error handling, and authentication
 */

import { handleError, isAuthError } from './errorHandler';

// Get API configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '60000', 10); // Increased to 60 seconds default

/**
 * Get authentication token from storage
 * Checks sessionStorage first, then localStorage as fallback
 */
const getAuthToken = () => {
  try {
    // Check sessionStorage first (for API-authenticated users)
    const sessionUser = sessionStorage.getItem('currentUser');
    if (sessionUser) {
      const user = JSON.parse(sessionUser);
      if (user.token) {
        return user.token;
      }
    }
    
    // Fallback to localStorage (for legacy/local users)
    const localUser = localStorage.getItem('currentUser');
    if (localUser) {
      const user = JSON.parse(localUser);
      if (user.token) {
        return user.token;
      }
    }
  } catch (error) {
    console.error('Error getting auth token:', error);
  }
  return null;
};

/**
 * Get default headers
 */
const getDefaultHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Create a fetch request with timeout
 */
const fetchWithTimeout = (url, options, timeout = API_TIMEOUT) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    ),
  ]);
};

/**
 * Make API request
 */
const request = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    params = null,
    timeout = API_TIMEOUT,
  } = options;

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined) {
        searchParams.append(key, params[key]);
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Merge headers
  const defaultHeaders = getDefaultHeaders();
  const mergedHeaders = {
    ...defaultHeaders,
    ...headers,
  };

  // Build request options
  const requestOptions = {
    method,
    headers: mergedHeaders,
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    if (body instanceof FormData) {
      // Remove Content-Type header for FormData (browser will set it automatically)
      delete mergedHeaders['Content-Type'];
      requestOptions.body = body;
    } else {
      requestOptions.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetchWithTimeout(url, requestOptions, timeout);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let data;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      // Handle backend error response format: { success: false, code, message, data }
      const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`;
      const error = new Error(errorMessage);
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: data, // Full error response from backend
      };
      throw error;
    }

    // Handle API response structure: { success, code, data, message }
    // If response has this structure, extract the data field
    const responseData = data.success !== undefined ? data.data : data;
    const responseMessage = data.message || null;

    return {
      data: responseData,
      fullResponse: data, // Include full response for cases where we need success/code/message
      message: responseMessage,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  } catch (error) {
    // Handle authentication errors
    if (isAuthError(error)) {
      // Clear auth data from both storages
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('isAuthenticated');
      
      // Update auth store to reflect logged out state
      // Import dynamically to avoid circular dependency
      import('../stores/authStore').then(({ useAuthStore }) => {
        useAuthStore.getState().signOut();
      }).catch(() => {
        // If store not available, continue with redirect
      });
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signin')) {
        window.location.href = '/signin';
      }
    }

    // Re-throw error for centralized error handling
    throw error;
  }
};

/**
 * API Client methods
 */
export const api = {
  /**
   * GET request
   */
  get: (endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  post: (endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'POST', body });
  },

  /**
   * PUT request
   */
  put: (endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'PUT', body });
  },

  /**
   * PATCH request
   */
  patch: (endpoint, body, options = {}) => {
    return request(endpoint, { ...options, method: 'PATCH', body });
  },

  /**
   * DELETE request
   */
  delete: (endpoint, options = {}) => {
    return request(endpoint, { ...options, method: 'DELETE' });
  },

  /**
   * Upload file
   */
  upload: (endpoint, file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    });
  },
};

export default api;

