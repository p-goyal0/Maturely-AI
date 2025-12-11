import { canAccessQuestion, canEditQuestion } from '../../utils/roleAssignment';

/**
 * AssessmentQuestionGuard Component
 * Wraps assessment questions to handle role-based access
 * 
 * @param {string} pillarId - Pillar identifier
 * @param {number} questionIndex - Question index
 * @param {Object} questionAssignment - Question assignment object from assessment data
 * @param {React.ReactNode} children - Question content
 * @param {React.ReactNode} noAccessFallback - Content to show if no access
 * @param {boolean} readOnly - If true, renders in read-only mode even if user can edit
 */
export function AssessmentQuestionGuard({
  pillarId,
  questionIndex,
  questionAssignment,
  children,
  noAccessFallback = null,
  readOnly = false,
}) {
  const questionId = `${pillarId}-${questionIndex}`;
  const canAccess = canAccessQuestion(questionAssignment, questionId);
  const canEdit = canEditQuestion(questionAssignment, questionId);
  
  if (!canAccess) {
    return noAccessFallback || (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 text-sm">
        You don't have access to this question.
      </div>
    );
  }
  
  // Clone children and pass canEdit prop
  return (
    <div className={readOnly || !canEdit ? 'opacity-75' : ''}>
      {typeof children === 'function' 
        ? children({ canEdit: readOnly ? false : canEdit })
        : children
      }
    </div>
  );
}


