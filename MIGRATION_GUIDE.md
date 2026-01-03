# RBAC Migration Guide

## Step 1: Install Zustand

```bash
npm install zustand
```

## Step 2: Update User Data Structure

Update your user data to include roles:

### Update `src/config/users.json`:

```json
{
  "users": [
    {
      "username": "admin",
      "password": "Maturelyai@3",
      "role": "SUPER_ADMIN",
      "email": "admin@example.com"
    },
    {
      "username": "moduleowner",
      "password": "password123",
      "role": "MODULE_OWNER",
      "email": "owner@example.com"
    },
    {
      "username": "billing",
      "password": "password123",
      "role": "BILLING_CONTACT",
      "email": "billing@example.com"
    }
  ]
}
```

## Step 3: Update AuthContext to Include Roles

Modify `src/contexts/AuthContext.jsx` to include role information:

```jsx
// In signIn function:
if (user) {
  setIsAuthenticated(true);
  setCurrentUser({ 
    username: user.username,
    role: user.role || 'MODULE_OWNER', // Default role
    email: user.email 
  });
  // Also update Zustand store
  useAuthStore.getState().setUser({
    username: user.username,
    role: user.role || 'MODULE_OWNER',
    email: user.email
  });
  // ... rest of code
}
```

## Step 4: Update Assessment Data Structure

Add role assignments to your assessment questions. You can do this incrementally:

### Option A: Add to existing structure (backward compatible)

```json
{
  "assessmentPillars": [
    {
      "id": "strategy-governance",
      "title": "Strategic Value & Governance",
      "questions": [...],
      "questionOptions": {...},
      "questionAssignments": {
        "0": ["MODULE_OWNER", "SUPER_ADMIN"],
        "1": ["SUPER_ADMIN"],
        "2": ["MODULE_OWNER", "BILLING_CONTACT"]
      },
      "stepAssignments": ["MODULE_OWNER", "SUPER_ADMIN"]
    }
  ]
}
```

### Option B: Start without assignments (all users can access)

If `questionAssignments` is missing, all users can access (backward compatible).

## Step 5: Update Components to Use RBAC

### Example: Update AssessmentsDashboard.jsx

```jsx
import { AssessmentQuestionGuard } from '../components/rbac/AssessmentQuestionGuard';
import { canAccessQuestion } from '../utils/roleAssignment';
import { useRole } from '../hooks/useRole';

// In your component:
const { isSuperAdmin } = useRole();
const questionAssignment = currentPillar.questionAssignments || {};

// Filter questions based on role
const accessibleQuestions = currentPillar.questions.filter((_, index) => {
  const questionId = `${currentPillar.id}-${index}`;
  return canAccessQuestion(questionAssignment, questionId);
});

// Wrap questions with guard
{currentPillar.questions.map((question, questionIndex) => {
  return (
    <AssessmentQuestionGuard
      key={questionIndex}
      pillarId={currentPillar.id}
      questionIndex={questionIndex}
      questionAssignment={questionAssignment}
      noAccessFallback={
        <div className="p-4 bg-gray-50 rounded-lg">
          This question is not assigned to your role.
        </div>
      }
    >
      {({ canEdit }) => (
        <QuestionComponent 
          question={question}
          canEdit={canEdit}
        />
      )}
    </AssessmentQuestionGuard>
  );
})}
```

## Step 6: Add Role Management UI (Super Admin Only)

Create a component for Super Admin to manage role assignments:

```jsx
import { SuperAdminGuard } from '../components/rbac/RoleGuard';
import { useRole } from '../hooks/useRole';

function RoleManagementPanel() {
  return (
    <SuperAdminGuard fallback={<div>Access Denied</div>}>
      <RoleAssignmentEditor />
    </SuperAdminGuard>
  );
}
```

## Step 7: Gradual Migration Strategy

1. **Phase 1**: Install Zustand and create stores (✅ Done)
2. **Phase 2**: Update user data to include roles
3. **Phase 3**: Add role assignments to assessment data (start with empty, allow all)
4. **Phase 4**: Update components to use RBAC guards (start with new features)
5. **Phase 5**: Migrate existing components one by one
6. **Phase 6**: Add Super Admin UI for role management

## Best Practices

1. **Start Small**: Begin with one feature (e.g., assessments)
2. **Backward Compatible**: Make role assignments optional initially
3. **Test Thoroughly**: Test each role's access to ensure proper restrictions
4. **Document Changes**: Keep track of which components use RBAC
5. **Super Admin First**: Always ensure Super Admin can access everything

## Troubleshooting

### Issue: User can't access questions they should see
- Check: User role is set correctly in user data
- Check: Question assignments include user's role
- Check: Super Admin can access (should work regardless)

### Issue: Zustand store not persisting
- Check: `persist` middleware is properly configured
- Check: localStorage is available in browser

### Issue: Components not updating when role changes
- Check: Components are using Zustand hooks correctly
- Check: Store is being updated when user signs in











