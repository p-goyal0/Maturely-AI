/**
 * Role Management API Service
 * Handles all role and permission-related API calls
 */

import api from './api';
import { getErrorMessage } from './errorHandler';

/**
 * Get all roles
 */
export const getRoles = async () => {
  try {
    const response = await api.get('/roles');
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
 * Get role by ID
 */
export const getRoleById = async (id) => {
  try {
    const response = await api.get(`/roles/${id}`);
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
 * Assign role to user
 */
export const assignRole = async (userId, roleId) => {
  try {
    const response = await api.post(`/roles/assign`, { userId, roleId });
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
 * Remove role from user
 */
export const removeRole = async (userId, roleId) => {
  try {
    const response = await api.delete(`/roles/assign`, {
      body: { userId, roleId },
    });
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
 * Get user roles
 */
export const getUserRoles = async (userId) => {
  try {
    const response = await api.get(`/roles/user/${userId}`);
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
 * Assign pillars to user
 */
export const assignPillars = async (userId, pillarIds) => {
  try {
    const response = await api.post(`/roles/pillars/assign`, {
      userId,
      pillarIds,
    });
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
 * Remove pillar from user
 */
export const removePillar = async (userId, pillarId) => {
  try {
    const response = await api.delete(`/roles/pillars/assign`, {
      body: { userId, pillarId },
    });
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
 * Get available pillars
 */
export const getAvailablePillars = async () => {
  try {
    const response = await api.get('/roles/pillars');
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
 * Get role statistics
 */
export const getRoleStats = async () => {
  try {
    const response = await api.get('/roles/stats');
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
 * Get organization members
 * @param {string} organizationId - Organization ID
 */
export const getOrganizationMembers = async (organizationId) => {
  try {
    const response = await api.get(`/organization/${organizationId}/users`);
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
      data: [],
    };
  }
};

/**
 * Get organization pillars
 */
export const getOrganizationPillars = async () => {
  try {
    const response = await api.get('/organization/pillars');
    return {
      success: true,
      data: response.data,
      message: response.message,
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error),
      data: [],
    };
  }
};

/**
 * Update member pillars
 * @param {string} organizationId - Organization ID
 * @param {string} userId - User ID
 * @param {string[]} pillarIds - Array of pillar IDs
 */
export const updateMemberPillars = async (organizationId, userId, pillarIds) => {
  try {
    const response = await api.patch(`/organization/${organizationId}/users/${userId}/pillars`, {
      pillar_ids: pillarIds,
    });
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

