# API Client

This module provides a comprehensive API client for communicating with the Rails backend API. It includes authentication handling, error management, and TypeScript interfaces for type safety.

## Features

- **Axios-based HTTP client** with base configuration
- **Automatic token management** with request/response interceptors
- **Token refresh mechanism** for seamless authentication
- **Comprehensive error handling** for different HTTP status codes
- **TypeScript interfaces** for API responses and data models
- **Integration with Zustand auth store** for state management
- **Unit and integration tests** for reliability

## Usage

### Basic Setup

```typescript
import { useAuthStore } from '@/stores/auth-store'
import apiClient, { setAuthStore } from '@/lib/api-client'

// Connect the API client with your auth store
setAuthStore(useAuthStore)
```

### Authentication API

```typescript
import { authApi } from '@/lib/api-client'

// Register a new user
const registerResult = await authApi.register({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  password_confirmation: 'password123',
})

// Login
const loginResult = await authApi.login({
  email: 'john@example.com',
  password: 'password123',
})

// Logout
await authApi.logout(refreshToken)

// Forgot password
await authApi.forgotPassword('john@example.com')

// Reset password
await authApi.resetPassword(token, 'newpassword', 'newpassword')
```

### User API

```typescript
import { userApi } from '@/lib/api-client'

// Get user profile
const profile = await userApi.getProfile()

// Update user profile
const updatedProfile = await userApi.updateProfile({
  first_name: 'Jane',
  last_name: 'Smith',
})
```

### Direct API Client Usage

```typescript
import apiClient from '@/lib/api-client'

// Make authenticated requests
const response = await apiClient.get('/some-endpoint')
const data = await apiClient.post('/another-endpoint', { data: 'value' })
```

### Error Handling

```typescript
import { isApiError, getErrorMessage } from '@/lib/api-client'

try {
  await authApi.login(credentials)
} catch (error) {
  if (isApiError(error)) {
    console.error('API Error:', error.type, error.message)
    if (error.details) {
      console.error('Details:', error.details)
    }
  } else {
    console.error('Unexpected error:', getErrorMessage(error))
  }
}
```

## TypeScript Interfaces

### AuthUser

```typescript
interface AuthUser {
  id: number
  first_name: string
  last_name: string
  email: string
  full_name: string
  initials: string
  confirmed: boolean
  is_super_admin: boolean
  created_at: string
  last_login_at: string | null
}
```

### AuthTokens

```typescript
interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}
```

### ApiError

```typescript
interface ApiError {
  type: string
  message: string
  code: string
  details?: string[]
}
```

## Error Types

The API client handles various error types:

- **AuthenticationError** (401): Invalid credentials, expired tokens
- **AuthorizationError** (403): Insufficient permissions
- **ValidationError** (422): Form validation failures
- **NotFoundError** (404): Resource not found
- **RateLimitError** (429): Too many requests
- **ServerError** (500+): Internal server errors
- **TimeoutError**: Request timeout
- **NetworkError**: Network connection issues

## Configuration

The API client uses environment variables for configuration:

```typescript
// Default configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'
const API_TIMEOUT = 10000
```

## Testing

The module includes comprehensive unit and integration tests:

```bash
# Run all tests
pnpm test:run

# Run specific test files
pnpm test:run api-client.test.ts
pnpm test:run api-client.integration.test.ts

# Run tests with UI
pnpm test:ui
```

## Token Management

The API client automatically handles token management:

1. **Request Interceptor**: Adds Bearer token to all authenticated requests
2. **Response Interceptor**: Handles 401 errors by attempting token refresh
3. **Token Refresh**: Automatically refreshes expired tokens using refresh token
4. **Fallback**: Redirects to login page when refresh fails

## Integration with Auth Store

The API client integrates with your Zustand auth store:

```typescript
// The auth store should provide these methods:
interface AuthStore {
  getState: () => {
    auth: {
      accessToken: string | null
      refreshToken: string | null
      setAccessToken: (token: string) => void
      setRefreshToken?: (token: string) => void
      reset: () => void
    }
  }
}
```

## Best Practices

1. **Always use the provided API methods** (`authApi`, `userApi`) instead of direct axios calls
2. **Handle errors appropriately** using `isApiError` and `getErrorMessage`
3. **Set up the auth store connection** early in your application lifecycle
4. **Use TypeScript interfaces** for type safety
5. **Test your API integrations** using the provided testing utilities
