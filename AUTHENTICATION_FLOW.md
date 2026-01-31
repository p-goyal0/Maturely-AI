# Authentication & Token Validation Flow

## 🔍 **Current Issues & Solutions**

### **Problem Identified**
When accessing the `/offerings` page (or any protected route), if the token is expired or invalid:
1. ❌ API returns 401 Unauthorized
2. ❌ `api.js` clears storage but doesn't update Zustand store
3. ❌ `ProtectedRoute` still thinks user is authenticated (checks store, not storage)
4. ❌ User sees 401 error instead of being redirected to sign-in

### **Root Cause**
- **ProtectedRoute** only checks `isAuthenticated` from Zustand store
- Store is initialized from storage on mount, but **never validates if token is actually valid**
- When 401 occurs, storage is cleared but **store state is not updated**
- No proactive token validation on route access

---

## ✅ **Solutions Implemented**

### **1. Token Validation in ProtectedRoute** (`components/ProtectedRoute.jsx`)

**What it does:**
- On mount, if user appears authenticated, validates token by calling `/auth/me`
- If token is valid → Updates user data and allows access
- If token is invalid → Signs out user and redirects to `/signin`

**Flow:**
```
ProtectedRoute mounts
  ↓
Check: isAuthenticated && currentUser?.token?
  ↓ YES
Call getCurrentUser() API
  ↓
Success? → Update user data → Allow access
  ↓
Failure? → signOut() → Redirect to /signin
```

**Benefits:**
- ✅ Proactive token validation before rendering protected content
- ✅ Catches expired tokens immediately
- ✅ Updates store state when token is invalid
- ✅ Prevents 401 errors from reaching the UI

### **2. Enhanced 401 Error Handling** (`services/api.js`)

**What it does:**
- When 401/403 occurs, clears **both** localStorage and sessionStorage
- Updates Zustand auth store state via `signOut()`
- Redirects to `/signin` page

**Changes:**
```javascript
// Before: Only cleared localStorage
localStorage.removeItem('currentUser');

// After: Clears both storages + updates store
localStorage.removeItem('currentUser');
sessionStorage.removeItem('currentUser');
useAuthStore.getState().signOut(); // Update store state
```

**Benefits:**
- ✅ Store state stays in sync with storage
- ✅ No stale authentication state
- ✅ Consistent logout behavior

### **3. Enhanced signOut** (`stores/authStore.js`)

**What it does:**
- Now clears both localStorage AND sessionStorage
- Ensures complete cleanup on logout

---

## 🔄 **Complete Authentication Flow**

### **On App Load / Route Access**

```
1. User navigates to protected route (e.g., /offerings)
   ↓
2. ProtectedRoute checks:
   - isLoading? → Show loading
   - isAuthenticated? → Continue
   ↓
3. Token Validation (NEW):
   - Call getCurrentUser() API
   - Valid? → Update user data → Render page
   - Invalid? → signOut() → Redirect to /signin
   ↓
4. Page renders (if token valid)
   ↓
5. API calls made with token
   ↓
6. If 401 occurs:
   - api.js catches error
   - Clears storage (localStorage + sessionStorage)
   - Updates auth store (signOut)
   - Redirects to /signin
```

### **On Sign In**

```
1. User enters credentials
   ↓
2. authService.signIn() called
   ↓
3. API returns token + user data
   ↓
4. Store in sessionStorage (API users) or localStorage (legacy)
   ↓
5. Update authStore:
   - setUser(userData)
   - isAuthenticated = true
   ↓
6. Navigate to /offerings or /industry
```

### **On Sign Out**

```
1. User clicks sign out
   ↓
2. authStore.signOut() called
   ↓
3. Clear storage (localStorage + sessionStorage)
   ↓
4. Update store:
   - currentUser = null
   - isAuthenticated = false
   ↓
5. Navigate to /signin
```

---

## 🛡️ **Security Improvements**

### **Before:**
- ❌ No token validation on route access
- ❌ Store state could be out of sync with storage
- ❌ 401 errors shown to user instead of redirect
- ❌ Only localStorage cleared on 401

### **After:**
- ✅ Token validated on every protected route access
- ✅ Store state always in sync with storage
- ✅ Automatic redirect on invalid token
- ✅ Both storages cleared on 401
- ✅ Store updated when 401 occurs

---

## 📝 **Key Files Modified**

1. **`components/ProtectedRoute.jsx`**
   - Added token validation on mount
   - Calls `getCurrentUser()` to validate token
   - Signs out if token invalid

2. **`services/api.js`**
   - Enhanced 401 error handling
   - Clears both localStorage and sessionStorage
   - Updates auth store state on 401

3. **`stores/authStore.js`**
   - Enhanced `signOut()` to clear sessionStorage too

---

## 🎯 **Best Practices Now Followed**

1. ✅ **Proactive Token Validation**: Validates token before allowing access
2. ✅ **State Synchronization**: Store and storage always in sync
3. ✅ **Graceful Error Handling**: 401 errors handled automatically
4. ✅ **User Experience**: No error messages, just smooth redirect
5. ✅ **Security**: Invalid tokens caught immediately

---

## 🔧 **How It Works Now**

### **Scenario 1: Valid Token**
```
User → /offerings → ProtectedRoute → Validate token → ✅ Valid → Render page
```

### **Scenario 2: Expired Token**
```
User → /offerings → ProtectedRoute → Validate token → ❌ Invalid → signOut() → Redirect to /signin
```

### **Scenario 3: 401 During API Call**
```
User → /offerings → API call → 401 → api.js handles → Clear storage → Update store → Redirect to /signin
```

---

## 💡 **Recommendations**

1. **Token Refresh**: Consider implementing automatic token refresh before expiration
2. **Caching**: Token validation result could be cached for a short time to avoid repeated calls
3. **Loading States**: Current loading state is good, but could add skeleton loaders
4. **Error Boundaries**: Consider adding error boundaries for unexpected errors

---

This implementation ensures that users with invalid tokens are automatically redirected to sign-in, preventing 401 errors from appearing in the UI.
