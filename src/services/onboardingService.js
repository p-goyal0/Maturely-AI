/**
 * Onboarding API Service
 * Handles user onboarding-related API calls
 */

import api from './api';
import { getErrorMessage } from './errorHandler';

/**
 * Submit onboarding data
 * @param {Object} onboardingData - Complete onboarding data from sessionStorage
 * @returns {Promise<Object>} Response with success status
 */
export const submitOnboarding = async (onboardingData) => {
  try {
    const response = await api.post('/user/onboard', onboardingData);

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
