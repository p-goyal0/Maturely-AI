/**
 * Billing API Service
 * Calls backend billing endpoints (Stripe config, plans, subscription, checkout, portal, etc.)
 * Uses shared api.js so auth and base URL are consistent.
 *
 * Aligned with Postman "Billing" collection:
 * - GET  /billing/config, /billing/plans, /billing/subscription, /billing/payment-methods, /billing/invoices?limit=
 * - POST /billing/subscription, /billing/subscription/resume, /billing/checkout, /billing/portal, /billing/setup-intent
 * - PUT  /billing/subscription
 * - DELETE /billing/subscription, /billing/payment-methods
 * (Webhook POST /billing/webhook/stripe is backend-only; not called from frontend.)
 */

import api from './api';
import { getErrorMessage } from './errorHandler';

/**
 * Get billing config (publishable key, billing_enabled). No auth required.
 * @returns {Promise<{ publishable_key: string, billing_enabled: boolean }>}
 */
export const getConfig = async () => {
  try {
    const response = await api.get('/billing/config');
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Get available plans. No auth required.
 * @returns {Promise<{ success: boolean, data?: Array, error?: string }>}
 */
export const getPlans = async () => {
  try {
    const response = await api.get('/billing/plans');
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Get current subscription (auth required).
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const getSubscription = async () => {
  try {
    const response = await api.get('/billing/subscription');
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Create subscription (auth required).
 * @param {string} planId
 * @param {string} [paymentMethodId]
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const createSubscription = async (planId, paymentMethodId) => {
  try {
    const response = await api.post('/billing/subscription', {
      plan_id: planId,
      payment_method_id: paymentMethodId,
    });
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Update subscription plan (auth required).
 * @param {string} planId
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const updateSubscription = async (planId) => {
  try {
    const response = await api.put('/billing/subscription', { plan_id: planId });
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Cancel subscription (auth required).
 * @param {boolean} [immediately=false]
 * @param {string} [reason]
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const cancelSubscription = async (immediately = false, reason) => {
  try {
    const response = await api.delete('/billing/subscription', {
      body: { immediately, reason },
    });
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Resume a canceled subscription (auth required).
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>}
 */
export const resumeSubscription = async () => {
  try {
    const response = await api.post('/billing/subscription/resume');
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Create Stripe Checkout session; redirect user to checkout_url (auth required).
 * @param {string} planId
 * @param {string} successUrl - e.g. window.location.origin + '/billing/success'
 * @param {string} cancelUrl - e.g. window.location.origin + '/billing/cancel'
 * @returns {Promise<{ success: boolean, data?: { checkout_url, session_id }, error?: string }>}
 */
export const createCheckoutSession = async (planId, successUrl, cancelUrl) => {
  try {
    const response = await api.post('/billing/checkout', {
      plan_id: planId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Create Stripe Billing Portal session; redirect user to portal_url (auth required).
 * @param {string} returnUrl - e.g. window.location.href or window.location.origin + '/settings'
 * @returns {Promise<{ success: boolean, data?: { portal_url }, error?: string }>}
 */
export const createBillingPortalSession = async (returnUrl) => {
  try {
    const response = await api.post('/billing/portal', { return_url: returnUrl });
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Create Setup Intent for saving a payment method (auth required).
 * @returns {Promise<{ success: boolean, data?: { client_secret, setup_intent_id }, error?: string }>}
 */
export const createSetupIntent = async () => {
  try {
    const response = await api.post('/billing/setup-intent');
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Get saved payment methods (auth required).
 * @returns {Promise<{ success: boolean, data?: Array, error?: string }>}
 */
export const getPaymentMethods = async () => {
  try {
    const response = await api.get('/billing/payment-methods');
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

/**
 * Delete a payment method (auth required).
 * @param {string} paymentMethodId
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const deletePaymentMethod = async (paymentMethodId) => {
  try {
    await api.delete('/billing/payment-methods', {
      body: { payment_method_id: paymentMethodId },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};

/**
 * Get recent invoices (auth required).
 * @param {number} [limit=10]
 * @returns {Promise<{ success: boolean, data?: Array, error?: string }>}
 */
export const getInvoices = async (limit = 10) => {
  try {
    const response = await api.get(`/billing/invoices?limit=${limit}`);
    return { success: true, data: response.data, message: response.message };
  } catch (error) {
    return { success: false, error: getErrorMessage(error), data: null };
  }
};

export default {
  getConfig,
  getPlans,
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  resumeSubscription,
  createCheckoutSession,
  createBillingPortalSession,
  createSetupIntent,
  getPaymentMethods,
  deletePaymentMethod,
  getInvoices,
};
