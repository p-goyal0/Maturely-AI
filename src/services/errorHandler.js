/**
 * Centralized Error Handling Utility
 * Provides consistent error handling across the application
 */

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, statusCode, data = null) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error types for categorization
 */
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * HTTP Status code mappings
 */
const STATUS_CODE_MAP = {
  400: ErrorTypes.VALIDATION_ERROR,
  401: ErrorTypes.AUTH_ERROR,
  403: ErrorTypes.AUTH_ERROR,
  404: ErrorTypes.NOT_FOUND_ERROR,
  500: ErrorTypes.SERVER_ERROR,
  502: ErrorTypes.SERVER_ERROR,
  503: ErrorTypes.SERVER_ERROR,
};

/**
 * Parse error response from API
 */
export const parseErrorResponse = (error) => {
  // Network errors (no response)
  if (!error.response) {
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return {
        type: ErrorTypes.NETWORK_ERROR,
        message: 'Network connection failed. Please check your internet connection.',
        statusCode: 0,
        data: null,
      };
    }
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        type: ErrorTypes.NETWORK_ERROR,
        message: 'Request timeout. Please try again.',
        statusCode: 408,
        data: null,
      };
    }
  }

  // API response errors
  const response = error.response || {};
  const statusCode = response.status || 500;
  const errorData = response.data || {};
  
  // Handle backend error response format: { success: false, code, message, data }
  const errorMessage = errorData.message || errorData.error || error.message || 'An unexpected error occurred';
  
  return {
    type: STATUS_CODE_MAP[statusCode] || ErrorTypes.UNKNOWN_ERROR,
    message: errorMessage,
    statusCode: errorData.code || statusCode,
    data: errorData,
  };
};

/**
 * Handle error and return user-friendly message
 */
export const handleError = (error) => {
  const parsedError = parseErrorResponse(error);
  
  // Log error for debugging (only in development)
  if (import.meta.env.VITE_ENV === 'development') {
    console.error('API Error:', {
      type: parsedError.type,
      message: parsedError.message,
      statusCode: parsedError.statusCode,
      data: parsedError.data,
      originalError: error,
    });
  }

  return parsedError;
};

/**
 * Get user-friendly error message
 */
export const getErrorMessage = (error) => {
  const parsedError = handleError(error);
  return parsedError.message;
};

/**
 * Check if error is a specific type
 */
export const isErrorType = (error, type) => {
  const parsedError = handleError(error);
  return parsedError.type === type;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error) => {
  return isErrorType(error, ErrorTypes.AUTH_ERROR);
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error) => {
  return isErrorType(error, ErrorTypes.NETWORK_ERROR);
};

