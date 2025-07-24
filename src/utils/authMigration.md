# Migration Guide: React Query Auth → Zustand Auth

## Overview
This guide shows how to migrate from the React Query-based authentication to Zustand-based authentication.

## Key Changes

### 1. State Management
- **Before**: React Query managed auth state with server calls
- **After**: Zustand manages auth state locally with JWT token decoding

### 2. Token Storage
- **Consistent**: Both use `authToken` key in localStorage
- **Validation**: Zustand validates token expiration on initialization

### 3. Hook Usage

#### Before (React Query)
```tsx
import { useAuth } from '../hooks/useAuth';

const { user, isAuthenticated, login, logout, isLoggingIn } = useAuth();
```

#### After (Zustand)
```tsx
import { useAuthZustand } from '../hooks/useAuthZustand';

const { user, isAuthenticated, login, logout, isLoggingIn } = useAuthZustand();
```

### 4. Direct Store Access
You can also access the store directly:

```tsx
import { useAuthStore } from '../stores/authStore';

// In component
const user = useAuthStore((state) => state.user);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const logout = useAuthStore((state) => state.logout);

// Outside component (e.g., in utilities)
import { useAuthStore } from '../stores/authStore';
const authState = useAuthStore.getState();
```

## Benefits of Zustand Approach

1. **Faster**: No server calls for auth state
2. **Simpler**: Direct state management without React Query complexity
3. **Consistent**: Single source of truth for auth state
4. **Automatic**: Token validation on app startup
5. **Reactive**: All components update automatically when auth state changes

## Migration Steps

1. ✅ Install Zustand (already done)
2. ✅ Create auth store (`src/stores/authStore.ts`)
3. ✅ Create Zustand auth hook (`src/hooks/useAuthZustand.tsx`)
4. ✅ Update API service to work with Zustand
5. ✅ Add AuthProvider to main.tsx
6. 🔄 Update components to use new hook
7. 🔄 Test authentication flow
8. 🔄 Remove old React Query auth hook

## Example Component Updates

### Login Component
```tsx
// Replace this import
import { useAuth } from '../../hooks/useAuth';

// With this import
import { useAuthZustand } from '../../hooks/useAuthZustand';

// Usage remains the same
const { login, isLoggingIn } = useAuthZustand();
```

### Protected Route
```tsx
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};
```

## Testing the Implementation

1. Start the app and check if existing tokens are loaded
2. Test login flow
3. Test logout flow
4. Test token expiration handling
5. Test automatic redirects on 401/403 errors