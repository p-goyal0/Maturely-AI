# Role-Based Access Control (RBAC) System

This directory contains reusable components for managing role-based access control in the application.

## Architecture Overview

### 1. **Constants** (`src/constants/`)
- `roles.js` - Defines all roles and role hierarchy
- `permissions.js` - Defines all permissions and role-permission mappings

### 2. **Stores** (`src/stores/`)
- `authStore.js` - Zustand store for authentication state
- `permissionStore.js` - Zustand store for permission checking

### 3. **Hooks** (`src/hooks/`)
- `useRole.js` - Hook for role checking
- `usePermission.js` - Hook for permission checking

### 4. **Components** (`src/components/rbac/`)
- `RoleGuard.jsx` - Component for role-based rendering
- `PermissionGuard.jsx` - Component for permission-based rendering

### 5. **Utils** (`src/utils/`)
- `roleAssignment.js` - Utilities for question/step role assignment

## Usage Examples

### Using RoleGuard Component

```jsx
import { RoleGuard, SuperAdminGuard } from '../components/rbac/RoleGuard';

// Single role
<RoleGuard allowedRoles="MODULE_OWNER">
  <ModuleOwnerContent />
</RoleGuard>

// Multiple roles (any of them)
<RoleGuard allowedRoles={["MODULE_OWNER", "SUPER_ADMIN"]}>
  <AdminContent />
</RoleGuard>

// Multiple roles (all required)
<RoleGuard allowedRoles={["MODULE_OWNER", "SUPER_ADMIN"]} requireAll>
  <SuperAdminOnlyContent />
</RoleGuard>

// With fallback
<RoleGuard 
  allowedRoles="SUPER_ADMIN" 
  fallback={<div>Access Denied</div>}
>
  <SuperAdminPanel />
</RoleGuard>

// Convenience component
<SuperAdminGuard>
  <SuperAdminOnlyContent />
</SuperAdminGuard>
```

### Using PermissionGuard Component

```jsx
import { PermissionGuard } from '../components/rbac/PermissionGuard';

// Single permission
<PermissionGuard requiredPermissions="ASSESSMENT_EDIT_ALL">
  <EditButton />
</PermissionGuard>

// Multiple permissions (any of them)
<PermissionGuard requiredPermissions={["ASSESSMENT_VIEW_ALL", "ASSESSMENT_EDIT_ALL"]}>
  <AssessmentPanel />
</PermissionGuard>

// All permissions required
<PermissionGuard 
  requiredPermissions={["USER_VIEW_ALL", "USER_EDIT"]} 
  requireAll
>
  <UserManagementPanel />
</PermissionGuard>
```

### Using Hooks

```jsx
import { useRole } from '../hooks/useRole';
import { usePermission } from '../hooks/usePermission';

function MyComponent() {
  const { role, isSuperAdmin, hasRole } = useRole();
  const { hasPermission } = usePermission();
  
  if (isSuperAdmin) {
    return <SuperAdminView />;
  }
  
  if (hasPermission('ASSESSMENT_EDIT_ASSIGNED')) {
    return <EditView />;
  }
  
  return <ReadOnlyView />;
}
```

### Assessment Question Role Assignment

```jsx
import { canAccessQuestion, canEditQuestion } from '../utils/roleAssignment';

function QuestionComponent({ question, questionIndex, pillarId }) {
  const questionId = `${pillarId}-${questionIndex}`;
  const questionAssignment = assessmentData.questionAssignments;
  
  const canAccess = canAccessQuestion(questionAssignment, questionId);
  const canEdit = canEditQuestion(questionAssignment, questionId);
  
  if (!canAccess) {
    return <div>You don't have access to this question</div>;
  }
  
  return (
    <div>
      {canEdit ? (
        <EditableQuestion question={question} />
      ) : (
        <ReadOnlyQuestion question={question} />
      )}
    </div>
  );
}
```

## Assessment Data Structure

To support role-based question assignment, extend your assessment data:

```json
{
  "assessmentPillars": [
    {
      "id": "strategy-governance",
      "title": "Strategic Value & Governance",
      "questions": [...],
      "questionAssignments": {
        "0": ["MODULE_OWNER", "SUPER_ADMIN"],
        "1": ["MODULE_OWNER"],
        "2": ["SUPER_ADMIN"]
      },
      "stepAssignments": ["MODULE_OWNER", "SUPER_ADMIN"]
    }
  ]
}
```

## Migration from Context to Zustand

The system is designed to work alongside the existing AuthContext. You can gradually migrate:

1. Start using Zustand stores for new features
2. Keep AuthContext for backward compatibility
3. Eventually migrate all components to use Zustand stores

## Best Practices

1. **Use RoleGuard/PermissionGuard for UI rendering** - Keeps logic out of components
2. **Use hooks for conditional logic** - More flexible for complex conditions
3. **Keep permission checks at the data level** - Filter data before rendering
4. **Use Super Admin sparingly** - Most features should work with specific permissions
5. **Document role assignments** - Keep clear documentation of who can do what











