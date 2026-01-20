/**
 * Assessment API Service
 * Handles all assessment-related API calls
 */

import api from './api';
import { getErrorMessage } from './errorHandler';

const FALLBACK_MODEL_ID = '075894e5-9614-4337-86f9-1c7e65fb4330';

/**
 * Start assessment (or continue ongoing assessment)
 * @param {string} [modelId] - Model ID from user's maturity_model_id (from sign-in). Falls back to default if not provided.
 * @param {string} [assessmentId] - Assessment ID from ongoing_assessment_id (from sign-in). If provided, continues existing assessment.
 */
export const startAssessment = async (modelId, assessmentId) => {
  try {
    const modelIdToUse = modelId || FALLBACK_MODEL_ID;
    const requestBody = {
      model_id: modelIdToUse,
    };
    
    // If assessmentId is provided, include it to continue existing assessment
    if (assessmentId) {
      requestBody.assessment_id = assessmentId;
    }
    
    const response = await api.post('/assessment/start', requestBody);
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

/**
 * Get questions for a pillar
 * @param {string} pillarId - Pillar ID from start assessment pillar_data
 * @param {string} assessmentId - Assessment ID from start assessment
 */
export const getPillarQuestions = async (pillarId, assessmentId) => {
  try {
    const response = await api.get(`/assessment/questions/${pillarId}?assessment_id=${assessmentId}`);
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

/**
 * Submit an answer for a question
 * @param {string} assessmentId - Assessment ID from start assessment
 * @param {string} questionId - Question ID from the questions API response
 * @param {string} selectedOptionId - Selected option ID from the questions API response
 */
export const submitAnswer = async (assessmentId, questionId, selectedOptionId) => {
  try {
    const response = await api.post('/assessment/submit-answer', {
      assessment_id: assessmentId,
      question_id: questionId,
      selected_option_id: selectedOptionId,
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

/**
 * Get assessment results
 * @param {string} assessmentId - Assessment ID from start assessment
 * @param {number} retries - Number of retry attempts (default: 2)
 */
export const getAssessmentResults = async (assessmentId, retries = 2) => {
  let lastError = null;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Use longer timeout for results endpoint (60 seconds) - this endpoint may take longer to process
      const response = await api.get(`/assessment/result/${assessmentId}`, {
        timeout: 60000, // 60 seconds timeout for results endpoint
      });
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      lastError = error;
      const errorMessage = getErrorMessage(error);
      
      // If it's a timeout and we have retries left, wait and retry
      if (errorMessage.includes('timeout') && attempt < retries) {
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      
      // If it's the last attempt or not a timeout, return error
      if (attempt === retries) {
        return {
          success: false,
          error: errorMessage,
        };
      }
    }
  }
  
  // Fallback (shouldn't reach here, but just in case)
  return {
    success: false,
    error: getErrorMessage(lastError),
  };
};
