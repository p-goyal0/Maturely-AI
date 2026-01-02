import { ROLES } from '../constants/roles';
import { useAuthStore } from '../stores/authStore';

/**
 * Check if current user can access a specific assessment question
 * 
 * @param {Object} questionAssignment - Question assignment object from assessment data
 * @param {string} questionId - Question identifier
 * @returns {boolean} Whether user can access the question
 */
export function canAccessQuestion(questionAssignment, questionId) {
  const userRole = useAuthStore.getState().getUserRole();
  
  // Super Admin can access everything
  if (userRole === ROLES.SUPER_ADMIN) {
    return true;
  }
  
  // If no assignment, allow all (backward compatibility)
  if (!questionAssignment || !questionAssignment[questionId]) {
    return true;
  }
  
  const assignedRoles = questionAssignment[questionId];
  
  // If empty array, no one can access (except Super Admin)
  if (!assignedRoles || assignedRoles.length === 0) {
    return false;
  }
  
  // Check if user's role is in the assigned roles
  return assignedRoles.includes(userRole);
}

/**
 * Check if current user can edit a specific assessment question
 * 
 * @param {Object} questionAssignment - Question assignment object from assessment data
 * @param {string} questionId - Question identifier
 * @returns {boolean} Whether user can edit the question
 */
export function canEditQuestion(questionAssignment, questionId) {
  const userRole = useAuthStore.getState().getUserRole();
  
  // Super Admin can edit everything
  if (userRole === ROLES.SUPER_ADMIN) {
    return true;
  }
  
  // Check if user can access (read access required for edit)
  if (!canAccessQuestion(questionAssignment, questionId)) {
    return false;
  }
  
  // Billing Contact is read-only
  if (userRole === ROLES.BILLING_CONTACT) {
    return false;
  }
  
  // Module Owner can edit if they have access
  return true;
}

/**
 * Filter questions based on user's role
 * 
 * @param {Array} questions - Array of question objects
 * @param {Object} questionAssignment - Question assignment object
 * @param {string} pillarId - Pillar identifier
 * @returns {Array} Filtered questions that user can access
 */
export function filterQuestionsByRole(questions, questionAssignment, pillarId) {
  return questions.filter((_, index) => {
    const questionId = `${pillarId}-${index}`;
    return canAccessQuestion(questionAssignment, questionId);
  });
}

/**
 * Get questions assigned to current user
 * 
 * @param {Array} questions - Array of question objects
 * @param {Object} questionAssignment - Question assignment object
 * @param {string} pillarId - Pillar identifier
 * @returns {Array} Questions assigned to current user
 */
export function getAssignedQuestions(questions, questionAssignment, pillarId) {
  const userRole = useAuthStore.getState().getUserRole();
  
  if (userRole === ROLES.SUPER_ADMIN) {
    return questions; // Super Admin sees all
  }
  
  return questions.filter((_, index) => {
    const questionId = `${pillarId}-${index}`;
    const assignedRoles = questionAssignment?.[questionId] || [];
    return assignedRoles.includes(userRole);
  });
}










