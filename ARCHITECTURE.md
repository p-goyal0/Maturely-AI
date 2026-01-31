# Codebase Architecture Documentation

## 📁 File Structure

```
src/
├── components/          # React components
│   ├── pages/          # Page-level components (routes)
│   ├── shared/         # Reusable shared components
│   ├── ui/             # UI primitives (shadcn/ui components)
│   ├── industry/       # Industry-specific components
│   ├── premium/        # Premium feature components
│   ├── rbac/           # Role-Based Access Control guards
│   ├── ProtectedRoute.jsx  # Route protection wrapper
│   └── PublicRoute.jsx     # Public route wrapper
│
├── stores/             # Zustand state management stores
│   ├── authStore.js        # Authentication state
│   ├── assessmentStore.js  # Assessment data
│   ├── companyStore.js     # Company/onboarding data
│   ├── industryStore.js    # Industry selection state
│   └── permissionStore.js  # RBAC permissions
│
├── services/           # API service layer
│   ├── api.js             # Centralized API client
│   ├── errorHandler.js    # Error handling utilities
│   ├── authService.js     # Authentication APIs
│   ├── assessmentService.js
│   ├── industryService.js
│   ├── onboardingService.js
│   ├── reportService.js
│   └── index.js           # Service exports
│
├── constants/          # Application constants
│   ├── roles.js           # Role definitions
│   ├── permissions.js     # Permission definitions
│   └── index.js
│
├── hooks/              # Custom React hooks
│   ├── usePermission.js
│   └── useRole.js
│
├── utils/              # Utility functions
│   ├── onboardingStorage.js
│   ├── logger.js
│   └── roleAssignment.js
│
├── config/             # Configuration files
│   └── users.json
│
├── data/               # Static data files
│   └── assessmentQuestions.json
│
├── App.jsx             # Main app component with routing
└── main.jsx            # Application entry point
```

---

## 🔄 State Management

### **Zustand Stores** (Lightweight state management)

The application uses **Zustand** for state management with persistence middleware.

#### **1. Auth Store** (`stores/authStore.js`)
- **Purpose**: Manages authentication state and user information
- **State**:
  - `isAuthenticated`: Boolean authentication status
  - `currentUser`: User object from API (includes token, roles, permissions)
  - `isLoading`: Loading state for auth checks
  - `users`: Local user registry (legacy support)
- **Actions**:
  - `signIn()`: Authenticate user via API
  - `signOut()`: Clear auth state
  - `setUser()`: Update current user
  - `updateOngoingAssessmentId()`: Update assessment tracking
  - `isSuperAdmin()`: Check admin status
- **Persistence**: Uses `localStorage` with sessionStorage fallback
- **Storage Strategy**:
  - API-authenticated users → `sessionStorage` (temporary)
  - Legacy/local users → `localStorage` (persistent)

#### **2. Assessment Store** (`stores/assessmentStore.js`)
- **Purpose**: Manages assessment data and progress
- **State**:
  - `assessmentId`: Current assessment ID
  - `modelId`, `modelTitle`, `modelDescription`: Assessment model info
  - `pillarData`: Array of pillar objects from API
  - `pillarQuestionsMap`: Cached questions per pillar
  - `assessmentResults`: Final assessment results
  - `isLoading`, `error`: Loading and error states
- **Actions**:
  - `setAssessmentData()`: Store assessment initialization data
  - `setPillarQuestions()`: Cache questions for a pillar
  - `setAssessmentResults()`: Store final results
  - `clearAssessment()`: Reset assessment state

#### **3. Company Store** (`stores/companyStore.js`)
- **Purpose**: Manages onboarding company information
- **State**:
  - `sectorType`: 'private-sector' | 'public-sector'
  - `companyType`: 'public' | 'private'
  - `isListed`, `stockTicker`: Public company details
  - `totalHeadcountRange`, `marketCapRange`, `annualRevenueRange`: Company metrics
- **Actions**:
  - `setSectorType()`: Set sector (clears company type if switching)
  - `setCompanyType()`: Set company type
  - `canContinueFromTypePage()`: Validation for navigation
  - `clearCompanyData()`: Reset onboarding data
- **Persistence**: Uses `sessionStorage` via `onboardingStorage.js`

#### **4. Industry Store** (`stores/industryStore.js`)
- **Purpose**: Manages industry selection during onboarding
- **State**:
  - `selectedIndustry`: Selected industry object
  - `selectedSubIndustry`: Selected sub-industry string
  - `industries`, `subIndustries`: Available options
- **Actions**:
  - `setSelectedIndustry()`: Update industry selection
  - `setSelectedSubIndustry()`: Update sub-industry
  - `canContinue()`: Check if can proceed to next step

#### **5. Permission Store** (`stores/permissionStore.js`)
- **Purpose**: Manages RBAC permissions
- **State**: Derived from `currentUser` in auth store
- **Actions**:
  - `checkPermission()`: Check single permission
  - `checkAnyPermission()`: Check if user has any of the permissions
  - `checkAllPermissions()`: Check if user has all permissions
  - `getUserPermissions()`: Get all user permissions

### **State Persistence Strategy**
- **Session Storage**: Temporary data (onboarding, API tokens)
- **Local Storage**: Persistent preferences (via Zustand persist middleware)
- **In-Memory**: Component-level state (React useState)

---

## 🌐 API Handling

### **Centralized API Client** (`services/api.js`)

#### **Configuration**
- **Base URL**: `VITE_API_BASE_URL` (default: `http://localhost:8000/api/v1`)
- **Timeout**: `VITE_API_TIMEOUT` (default: 60 seconds)
- **Environment**: Uses Vite's `import.meta.env`

#### **Features**
1. **Automatic Token Injection**
   - Checks `sessionStorage` first (API users)
   - Falls back to `localStorage` (legacy users)
   - Adds `Authorization: Bearer <token>` header

2. **Request Timeout**
   - Configurable timeout per request
   - Default: 60 seconds
   - Uses `Promise.race()` for timeout handling

3. **Response Handling**
   - Supports JSON and text responses
   - Handles API response structure: `{ success, code, data, message }`
   - Extracts `data` field automatically
   - Returns full response object with metadata

4. **Error Handling**
   - Automatic auth error detection
   - Redirects to `/signin` on 401/403
   - Preserves error context for error handler

#### **API Methods**
```javascript
api.get(endpoint, options)
api.post(endpoint, body, options)
api.put(endpoint, body, options)
api.patch(endpoint, body, options)
api.delete(endpoint, options)
api.upload(endpoint, file, options)  // File uploads
```

#### **Service Layer Pattern**
Each domain has its own service file:
- `authService.js`: Authentication endpoints
- `assessmentService.js`: Assessment operations
- `industryService.js`: Industry data
- `onboardingService.js`: Onboarding flow
- `reportService.js`: PDF generation
- All services use the centralized `api` client
- All services use `getErrorMessage()` for consistent error handling

---

## ⚠️ Error Handling

### **Error Handler** (`services/errorHandler.js`)

#### **Error Types**
```javascript
ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}
```

#### **Error Processing Flow**
1. **Parse Error Response**
   - Detects network errors (no response)
   - Detects timeout errors
   - Extracts error message from API response
   - Maps HTTP status codes to error types

2. **User-Friendly Messages**
   - Network errors → "Network connection failed..."
   - Timeout errors → "Request timeout. Please try again."
   - API errors → Uses `error.message` or `error.error` from response
   - Fallback → "An unexpected error occurred"

3. **Error Utilities**
   - `getErrorMessage(error)`: Get user-friendly message
   - `isAuthError(error)`: Check if authentication error
   - `isNetworkError(error)`: Check if network error
   - `handleError(error)`: Full error processing

#### **Error Handling in Services**
```javascript
try {
  const response = await api.post('/endpoint', data);
  return { success: true, data: response.data };
} catch (error) {
  return {
    success: false,
    error: getErrorMessage(error)  // User-friendly message
  };
}
```

#### **Error Display Components**
- `ErrorDisplay.jsx`: Reusable error message component
- Used in pages for consistent error UI

---

## 🔒 Security

### **Authentication & Authorization**

#### **1. Token Management**
- **Storage**: Tokens stored in `sessionStorage` (API users) or `localStorage` (legacy)
- **Injection**: Automatic via API client headers
- **Expiration**: Handled by backend (401/403 responses)
- **Refresh**: `refreshToken()` service available (not auto-implemented)

#### **2. Route Protection**
- **ProtectedRoute**: Wraps authenticated routes
  - Checks `isAuthenticated` from auth store
  - Redirects to `/signin` if not authenticated
  - Handles onboarding flow redirects
  - Shows loading state during auth check

- **PublicRoute**: Wraps public routes
  - Redirects authenticated users away from login/signup
  - Shows loading state during auth check

#### **3. Role-Based Access Control (RBAC)**

**Roles** (`constants/roles.js`):
- `SUPER_ADMIN`: Full system access
- `MODULE_OWNER`: Module-level access
- `BILLING_CONTACT`: Billing-only access

**Permissions** (`constants/permissions.js`):
- Assessment permissions (view/edit/assign)
- User management permissions
- Billing permissions
- Settings permissions

**Permission Guards** (`components/rbac/`):
- `PermissionGuard`: Conditionally renders based on permissions
- `RoleGuard`: Conditionally renders based on roles
- `AssessmentQuestionGuard`: Assessment-specific access control

**Usage**:
```jsx
<PermissionGuard requiredPermissions={PERMISSIONS.USER_VIEW_ALL}>
  <UserList />
</PermissionGuard>
```

#### **4. Security Best Practices**
- ✅ Tokens never logged or exposed in URLs
- ✅ Automatic token injection (no manual header management)
- ✅ Session-based storage for sensitive data
- ✅ Error messages don't expose sensitive information
- ✅ CORS handled by backend
- ✅ Input validation on forms
- ✅ XSS protection via React's built-in escaping

---

## 🛣️ Routing

### **Route Structure** (`App.jsx`)

#### **Public Routes**
- `/` - Landing page (HomePage)
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/login` - Legacy login page

#### **Protected Routes** (Require Authentication)
- `/industry` - Industry selection (onboarding)
- `/company-type` - Company type selection (onboarding)
- `/company-info` - Company information (onboarding)
- `/offerings` - Main dashboard/offerings page
- `/assessments` - Assessment taking interface
- `/results` - Assessment results page
- `/roadmap` - Roadmap generator
- `/usecases` - Use case library
- `/role-management` - Role management (admin)
- `/team-management` - Team/user management (admin)
- `/settings` - User settings

#### **Route Guards**
- All protected routes wrapped in `<ProtectedRoute>`
- Automatic redirects based on authentication state
- Onboarding flow protection (redirects if already complete)

---

## 📦 Key Dependencies

### **Core Framework**
- **React 18.3.1**: UI framework
- **React Router DOM 7.9.6**: Client-side routing
- **Vite 6.3.5**: Build tool and dev server

### **State Management**
- **Zustand 5.0.9**: Lightweight state management

### **UI Libraries**
- **Radix UI**: Headless UI components (buttons, dialogs, dropdowns, etc.)
- **Tailwind CSS 4.1.17**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Recharts**: Chart library (radar, pie charts)
- **Ant Design 5.22.6**: UI component library (Skeleton, etc.)
- **Lucide React**: Icon library

### **Utilities**
- **jsPDF 4.0.0**: PDF generation
- **html2canvas 1.4.1**: Screenshot/canvas conversion
- **Lottie React**: Animation files

---

## 🔧 Development Patterns

### **Component Structure**
```
Component/
├── Imports (React, hooks, stores, services)
├── Constants/Config (if needed)
├── Component Function
│   ├── Hooks (useState, useEffect, custom hooks)
│   ├── Store subscriptions (Zustand)
│   ├── Event handlers
│   └── JSX return
└── Export
```

### **Service Pattern**
```javascript
// services/exampleService.js
import api from './api';
import { getErrorMessage } from './errorHandler';

export const exampleFunction = async (params) => {
  try {
    const response = await api.post('/endpoint', params);
    return {
      success: true,
      data: response.data,
      message: response.message
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
};
```

### **Store Pattern**
```javascript
// stores/exampleStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useExampleStore = create(
  persist(
    (set, get) => ({
      // State
      data: null,
      
      // Actions
      setData: (data) => set({ data }),
      clearData: () => set({ data: null })
    }),
    {
      name: 'example-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

---

## 📝 Data Flow

### **Typical User Flow**
1. **Sign In** → `authService.signIn()` → Updates `authStore` → Token stored
2. **Onboarding** → Industry/Company stores → `sessionStorage` → API submission
3. **Assessment** → `assessmentStore` → API calls → Results stored
4. **Results** → Display from `assessmentStore.assessmentResults`

### **API Call Flow**
```
Component
  ↓
Service Function (e.g., authService.signIn)
  ↓
api.post/get/etc (services/api.js)
  ↓
fetch() with timeout
  ↓
Response/Error
  ↓
errorHandler.js (if error)
  ↓
Return to Component
```

---

## 🚀 Build & Deployment

### **Build Configuration** (`vite.config.js`)
- **Target**: ESNext
- **Output**: `dist/` directory
- **Minification**: Terser
- **Source Maps**: Disabled in production
- **Port**: 5173 (dev server)

### **Environment Variables**
- `VITE_API_BASE_URL`: API server URL
- `VITE_API_TIMEOUT`: Request timeout (ms)
- `VITE_ENV`: Environment (development/production)

### **Docker Support**
- `Dockerfile`: Production build
- `docker-compose.yml`: Container orchestration
- `nginx.conf`: Web server configuration
- `DEPLOYMENT.md`: Deployment instructions

---

## 📚 Additional Notes

### **Onboarding Flow**
- Uses `sessionStorage` for temporary data
- Managed by `onboardingStorage.js` utility
- Data submitted to API at completion
- Cleared after successful submission

### **Assessment Flow**
- Questions loaded on-demand per pillar
- Answers cached in component state
- Submitted via `submitAnswer()` API
- Results fetched via `getAssessmentResults()`

### **PDF Report Generation**
- Uses `html2canvas` to capture charts
- Uses `jsPDF` to generate PDF
- Handles chart sizing and page breaks
- Includes assessment data and visualizations

---

## 🎯 Best Practices Followed

1. ✅ **Separation of Concerns**: Services, stores, components clearly separated
2. ✅ **Centralized Error Handling**: Single error handler for consistency
3. ✅ **Type Safety**: Constants for roles/permissions (could add TypeScript)
4. ✅ **Reusability**: Shared components and utilities
5. ✅ **Security**: Token management, route protection, RBAC
6. ✅ **Performance**: Lazy loading, on-demand data fetching
7. ✅ **User Experience**: Loading states, error messages, skeleton loaders

---

This architecture provides a scalable, maintainable foundation for the AI Readiness Assessment Platform.
