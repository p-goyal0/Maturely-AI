/**
 * Settings API Service
 * Handles all settings-related API calls
 */

import api from './api';
import { handleError, getErrorMessage } from './errorHandler';

/**
 * Get organization settings
 */
export const getSettings = async () => {
  try {
    const response = await api.get('/settings');
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
 * Update organization settings
 */
export const updateSettings = async (settingsData) => {
  try {
    const response = await api.put('/settings', settingsData);
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
 * Get notification preferences
 */
export const getNotificationPreferences = async () => {
  try {
    const response = await api.get('/settings/notifications');
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
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    const response = await api.put('/settings/notifications', preferences);
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
 * Get billing information
 */
export const getBillingInfo = async () => {
  try {
    const response = await api.get('/settings/billing');
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
 * Update payment method
 */
export const updatePaymentMethod = async (paymentData) => {
  try {
    const response = await api.put('/settings/billing/payment', paymentData);
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

