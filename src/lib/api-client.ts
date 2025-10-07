/**
 * API Client
 * Cliente Axios configurado con autenticación, interceptores y manejo de tokens
 * 
 * Este archivo re-exporta el cliente de api-client-base.ts para mantener
 * compatibilidad con las importaciones existentes
 */

// Exportar el cliente principal y utilidades
export { default, apiClient, tokenManager, setAuthStore } from './api-client-base'

// Re-exportar tipos útiles
export type { AuthTokens } from '@/stores/auth-store'
