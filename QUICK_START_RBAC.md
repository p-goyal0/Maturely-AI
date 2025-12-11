# RBAC Quick Start Guide

## 🚀 Installation

```bash
npm install zustand
```

## 📝 Step 1: Add Roles to Users

Update `src/config/users.json`:

```json
{
  "users": [
    {
      "username": "admin",
      "password": "Maturelyai@3",
      "role": "SUPER_ADMIN"
    },
    {
      "username": "owner",
      "password": "password123",
      "role": "MODULE_OWNER"
    },
    {
      "username": "billing",
      "password": "password123",
      "role": "BILLING_CONTACT"
    }
  ]
}
```

## 📝 Step 2: Update AuthContext

In `src/contexts/AuthContext.jsx`, update the `signIn` function:

```jsx
import { useAuthStore } from '../stores/authStore';

const signIn = (username, password) => {
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const userData = { 
      username: user.username,
      role: user.role || 'MODULE_OWNER' // Default role
    };
    
    setIsAuthenticated(true);
    setCurrentUser(userData);
    
    // Sync with Zustand store
    useAuthStore.getState().signIn(userData);
    
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));
    return { success: true };
  }
  
  return { success: false, error: "Invalid username or password" };
};
```

## 📝 Step 3: Use in Components

### Example 1: Protect a Button

```jsx
import { PermissionGuard } from '../components/rbac/PermissionGuard';

<PermissionGuard requiredPermissions="ASSESSMENT_EDIT_ALL">
  <button>Edit Assessment</button>
</PermissionGuard>
```

### Example 2: Show Different Views

```jsx
import { useRole } from '../hooks/useRole';

function Dashboard() {
  const { isSuperAdmin, isModuleOwner } = useRole();
  
  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }
  
  if (isModuleOwner) {
    return <ModuleOwnerDashboard />;
  }
  
  return <BillingDashboard />;
}
```

### Example 3: Assessment Questions

```jsx
import { AssessmentQuestionGuard } from '../components/rbac/AssessmentQuestionGuard';

{questions.map((question, index) => (
  <AssessmentQuestionGuard
    key={index}
    pillarId={pillar.id}
    questionIndex={index}
    questionAssignment={pillar.questionAssignments}
  >
    {({ canEdit }) => (
      <QuestionComponent 
        question={question}
        canEdit={canEdit}
      />
    )}
  </AssessmentQuestionGuard>
))}
```

## 📝 Step 4: Add Role Assignments to Assessment Data

In `src/data/assessmentQuestions.json`, add:

```json
{
  "assessmentPillars": [
    {
      "id": "strategy-governance",
      "questions": [...],
      "questionAssignments": {
        "0": ["MODULE_OWNER", "SUPER_ADMIN"],
        "1": ["SUPER_ADMIN"]
      },
      "stepAssignments": ["MODULE_OWNER", "SUPER_ADMIN"]
    }
  ]
}
```

**Note**: If `questionAssignments` is missing, all users can access (backward compatible).

## 🎯 Common Patterns

### Pattern 1: Conditional Rendering
```jsx
const { hasPermission } = usePermission();
{hasPermission('USER_EDIT') && <EditButton />}
```

### Pattern 2: Multiple Roles
```jsx
<RoleGuard allowedRoles={["MODULE_OWNER", "SUPER_ADMIN"]}>
  <AdminContent />
</RoleGuard>
```

### Pattern 3: All Permissions Required
```jsx
<PermissionGuard 
  requiredPermissions={["USER_VIEW", "USER_EDIT"]} 
  requireAll
>
  <UserManagementPanel />
</PermissionGuard>
```

## 🔍 Available Roles

- `SUPER_ADMIN` - Full access
- `MODULE_OWNER` - Manage assigned assessments
- `BILLING_CONTACT` - Read-only billing and assigned assessments

## 🔍 Common Permissions

- `ASSESSMENT_VIEW_ALL` - View all assessments
- `ASSESSMENT_EDIT_ALL` - Edit all assessments
- `ASSESSMENT_VIEW_ASSIGNED` - View assigned assessments
- `ASSESSMENT_EDIT_ASSIGNED` - Edit assigned assessments
- `USER_VIEW_ALL` - View all users
- `USER_EDIT` - Edit users
- `BILLING_VIEW` - View billing
- `BILLING_EDIT` - Edit billing

See `src/constants/permissions.js` for full list.

## 📚 More Information

- **Detailed Guide**: `src/components/rbac/README.md`
- **Migration Guide**: `MIGRATION_GUIDE.md`
- **Implementation Summary**: `RBAC_IMPLEMENTATION_SUMMARY.md`


