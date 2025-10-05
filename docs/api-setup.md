# API Setup Documentation

## Overview

This document describes the API integration setup between the React frontend and Rails backend.

## Configuration

### Environment Variables

Create a `.env.local` file in the frontend root with:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api/v1

# Clerk Configuration (if using Clerk)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### CORS Configuration

The Rails backend is configured to allow cross-origin requests from:
- `http://localhost:3000` (frontend development server)
- `http://localhost:3001` (backend development server)

CORS settings include:
- Credentials enabled
- All standard HTTP methods allowed
- Custom headers allowed

## API Client

The API client is configured with:
- Base URL from environment variables
- 10-second timeout
- Automatic credential inclusion
- Request/response interceptors for error handling

## Testing API Connection

To verify the API connection is working:

1. Start the Rails server: `cd iswo_academy_core && bundle exec rails server -p 3001`
2. Start the frontend server: `cd iswo_academy_client && npm run dev`
3. The API client will automatically connect to the backend

## Available Endpoints

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `DELETE /auth/logout` - User logout
- `POST /auth/forgot_password` - Password reset request
- `POST /auth/reset_password` - Password reset

### Health Check
- `GET /up` - Server health check (outside API namespace)

## Error Handling

The API client handles:
- 401 Unauthorized (authentication errors)
- 403 Forbidden (authorization errors)
- 500+ Server errors
- Network timeouts
- Connection errors

## Next Steps

1. Implement authentication store integration
2. Add token refresh mechanism
3. Create API service methods for each endpoint
4. Add comprehensive error handling in components