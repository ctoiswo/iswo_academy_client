/**
 * API Client
 * Cliente Axios configurado con autenticación, interceptores y manejo de tokens
 * 
 * Este archivo re-exporta el cliente de api-client-base.ts para mantener
 * compatibilidad con las importaciones existentes
 */

// Exportar el cliente principal y utilidades
export {
  default,
  apiClient,
  tokenManager,
  setAuthStore,
  isApiError,
  getErrorMessage // @deprecated Use getErrorMessage from lib/error-handler.ts
} from './api-client-base'

// Re-exportar tipos útiles
export type { AuthTokens } from '@/stores/auth-store'
export type { ApiError } from './api-client-base'

// Exportar Super Admin API
export { superAdminApi } from './super-admin-api'
export type { GlobalStats, AcademyOverview, AcademyCreator, AcademiesResponse, GetAcademiesParams } from './super-admin-api'
