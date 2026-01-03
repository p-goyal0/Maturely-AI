/**
 * Team Management API Service
 * Handles all team member-related API calls
 */

import api from './api';
import { handleError, getErrorMessage } from './errorHandler';

/**
 * Get all team members
 */
export const getTeamMembers = async (params = {}) => {
  try {
    const response = await api.get('/team/members', { params });
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
 * Get team member by ID
 */
export const getTeamMemberById = async (id) => {
  try {
    const response = await api.get(`/team/members/${id}`);
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
 * Invite team member
 */
export const inviteTeamMember = async (memberData) => {
  try {
    const response = await api.post('/team/invite', memberData);
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
 * Update team member
 */
export const updateTeamMember = async (id, memberData) => {
  try {
    const response = await api.put(`/team/members/${id}`, memberData);
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
 * Remove team member
 */
export const removeTeamMember = async (id) => {
  try {
    const response = await api.delete(`/team/members/${id}`);
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
 * Activate team member
 */
export const activateTeamMember = async (id) => {
  try {
    const response = await api.post(`/team/members/${id}/activate`);
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
 * Deactivate team member
 */
export const deactivateTeamMember = async (id) => {
  try {
    const response = await api.post(`/team/members/${id}/deactivate`);
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
 * Resend invitation
 */
export const resendInvitation = async (id) => {
  try {
    const response = await api.post(`/team/invite/${id}/resend`);
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
 * Search team members
 */
export const searchTeamMembers = async (query) => {
  try {
    const response = await api.get('/team/members/search', {
      params: { q: query },
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

