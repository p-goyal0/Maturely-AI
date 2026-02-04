/**
 * Use Case API Service
 * Handles all use case-related API calls
 */

import api from './api';
import { getErrorMessage } from './errorHandler';

/**
 * Get all use cases
 */
export const getUseCases = async (params = {}) => {
  try {
    const response = await api.get('/usecases', { params });
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
 * Get use case list (Inspire Me – all use cases from pool).
 * GET /api/v1/use-case/list with Bearer token.
 */
export const getUseCaseList = async () => {
  try {
    const response = await api.get('/use-case/list');
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
 * Get use case detail by UUID.
 * GET /api/v1/use-case/{useCaseUuid} with Bearer token.
 */
export const getUseCaseDetail = async (useCaseUuid) => {
  try {
    const response = await api.get(`/use-case/${useCaseUuid}`);
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
 * Get use case by ID
 */
export const getUseCaseById = async (id) => {
  try {
    const response = await api.get(`/usecases/${id}`);
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
 * Create new use case
 */
export const createUseCase = async (useCaseData) => {
  try {
    const response = await api.post('/usecases', useCaseData);
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
 * Update use case
 */
export const updateUseCase = async (id, useCaseData) => {
  try {
    const response = await api.put(`/usecases/${id}`, useCaseData);
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
 * Delete use case
 */
export const deleteUseCase = async (id) => {
  try {
    const response = await api.delete(`/usecases/${id}`);
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
 * Get industry use cases
 */
export const getIndustryUseCases = async (industry) => {
  try {
    const response = await api.get(`/usecases/industry/${industry}`);
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
 * Search use cases
 */
export const searchUseCases = async (query, filters = {}) => {
  try {
    const response = await api.get('/usecases/search', {
      params: {
        q: query,
        ...filters,
      },
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
 * Get personalized use cases
 */
export const getPersonalizedUseCases = async (query, filters = {}) => {
  try {
    const response = await api.post('/usecases/personalize', {
      query,
      filters,
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
 * Toggle use case visibility (public/private)
 */
export const toggleUseCaseVisibility = async (id, visibility) => {
  try {
    const response = await api.patch(`/usecases/${id}/visibility`, { visibility });
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

