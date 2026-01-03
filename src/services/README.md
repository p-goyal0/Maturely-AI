# API Services Documentation

This directory contains all API-related services following centralized architecture principles.

## Structure

```
services/
├── api.js              # Centralized API client with interceptors
├── errorHandler.js     # Centralized error handling utilities
├── authService.js      # Authentication API calls
├── useCaseService.js   # Use case management API calls
├── roleService.js      # Role and permission API calls
├── teamService.js      # Team management API calls
├── settingsService.js  # Settings API calls
└── index.js            # Centralized exports
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# API Timeout (in milliseconds)
VITE_API_TIMEOUT=30000

# Environment
VITE_ENV=development
```

## Usage

### Basic API Call

```javascript
import { api } from '@/services';

// GET request
const response = await api.get('/endpoints/resource');

// POST request
const response = await api.post('/endpoints/resource', { data: 'value' });

// PUT request
const response = await api.put('/endpoints/resource/1', { data: 'value' });

// DELETE request
const response = await api.delete('/endpoints/resource/1');
```

### Using Service Modules

```javascript
import { signIn, signUp } from '@/services/authService';

// Sign in
const result = await signIn({ username: 'user', password: 'pass' });
if (result.success) {
  // Handle success
} else {
  // Handle error
  console.error(result.error);
}
```

### Error Handling

```javascript
import { handleError, getErrorMessage, isAuthError } from '@/services/errorHandler';

try {
  const response = await api.get('/endpoints/resource');
} catch (error) {
  const parsedError = handleError(error);
  
  if (isAuthError(error)) {
    // Handle authentication error
  }
  
  // Get user-friendly message
  const message = getErrorMessage(error);
}
```

## Features

### Centralized API Client (`api.js`)
- Automatic authentication token injection
- Request/response interceptors
- Timeout handling
- Query parameter support
- FormData support for file uploads
- Automatic error handling

### Error Handling (`errorHandler.js`)
- Consistent error parsing
- User-friendly error messages
- Error type categorization
- Network error detection
- Authentication error handling

### Service Modules
Each service module follows the same pattern:
- Returns `{ success: boolean, data?: any, error?: string }`
- Handles errors internally
- Provides consistent API

## Best Practices

1. **Always use service modules** instead of calling `api` directly in components
2. **Handle errors** using the centralized error handler
3. **Check `success` flag** before using data
4. **Use TypeScript** (when available) for type safety
5. **Keep service methods focused** - one responsibility per method

## Adding New Services

1. Create a new service file (e.g., `assessmentService.js`)
2. Import `api` and `errorHandler`
3. Follow the existing pattern
4. Export from `index.js`

Example:

```javascript
import api from './api';
import { getErrorMessage } from './errorHandler';

export const getAssessments = async () => {
  try {
    const response = await api.get('/assessments');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: getErrorMessage(error) };
  }
};
```

