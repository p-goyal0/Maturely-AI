/**
 * Utility for managing onboarding details in sessionStorage
 * Stores selections from Industry, Company Type, and Company Info pages
 */

const STORAGE_KEY = 'onboardingDetails';

/**
 * Get onboarding details from sessionStorage
 * @returns {Object} Onboarding details object
 */
export const getOnboardingDetails = () => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading onboarding details from sessionStorage:', error);
    return {};
  }
};

/**
 * Update onboarding details in sessionStorage
 * @param {Object} updates - Partial object with fields to update
 */
export const updateOnboardingDetails = (updates) => {
  try {
    const current = getOnboardingDetails();
    const updated = { ...current, ...updates };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating onboarding details in sessionStorage:', error);
  }
};

/**
 * Clear onboarding details from sessionStorage
 */
export const clearOnboardingDetails = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing onboarding details from sessionStorage:', error);
  }
};

/**
 * Update a specific question in the onboarding questionnaire
 * @param {string} question - The question text
 * @param {string} answer - The answer text
 * @param {number} order - The order of the question
 * @param {string} ownership - "public" or "private"
 */
export const updateQuestionnaireAnswer = (question, answer, order, ownership) => {
  try {
    const current = getOnboardingDetails();
    const questionnaire = current.onboarding_org_questionaire || [];
    
    // Find existing question by question text and ownership
    const existingIndex = questionnaire.findIndex(
      (q) => q.question === question && q.ownership === ownership
    );
    
    // If answer is empty, remove the question
    if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
      if (existingIndex >= 0) {
        questionnaire.splice(existingIndex, 1);
        updateOnboardingDetails({
          onboarding_org_questionaire: questionnaire,
        });
      }
      return;
    }
    
    const questionData = {
      question,
      answer,
      order,
      ownership,
    };
    
    if (existingIndex >= 0) {
      // Update existing question
      questionnaire[existingIndex] = questionData;
    } else {
      // Add new question
      questionnaire.push(questionData);
    }
    
    // Keep all questions (don't filter here - let clearQuestionnaireByOwnership handle clearing)
    updateOnboardingDetails({
      onboarding_org_questionaire: questionnaire,
    });
  } catch (error) {
    console.error('Error updating questionnaire answer:', error);
  }
};

/**
 * Clear questionnaire for a specific ownership type
 * @param {string} ownership - "public" or "private"
 */
export const clearQuestionnaireByOwnership = (ownership) => {
  try {
    const current = getOnboardingDetails();
    const questionnaire = current.onboarding_org_questionaire || [];
    const filteredQuestionnaire = questionnaire.filter((q) => q.ownership !== ownership);
    
    updateOnboardingDetails({
      onboarding_org_questionaire: filteredQuestionnaire,
    });
  } catch (error) {
    console.error('Error clearing questionnaire:', error);
  }
};
