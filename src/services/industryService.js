/**
 * Industry API Service
 * Handles all industry-related API calls
 */

import api from './api';
import { getErrorMessage } from './errorHandler';

/**
 * Get all industries with sub-industries
 */
export const getIndustries = async () => {
  try {
    const response = await api.get('/common/industries');
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
