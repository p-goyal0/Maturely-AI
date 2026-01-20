/**
 * Common API Service
 * Handles common/shared API endpoints
 */

import api from './api';
import { getErrorMessage } from './errorHandler';

/**
 * Search stock tickers
 * @param {string} query - Search query (minimum 2 characters)
 * @returns {Promise<Object>} Response with stock data
 */
export const searchStockTickers = async (query) => {
  try {
    if (!query || query.length < 2) {
      return {
        success: false,
        error: 'Query must be at least 2 characters',
        data: [],
      };
    }

    const response = await api.get('/common/stock', {
      params: { q: query },
    });

    return {
      success: true,
      data: response.data || [],
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
