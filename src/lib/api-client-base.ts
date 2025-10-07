/**
 * API Client Base
 * Cliente Axios configurado con autenticación, interceptores y manejo de tokens
 */

import axios, { 
  type AxiosInstance, 
  type AxiosRequestConfig, 
  type AxiosResponse,
  type InternalAxiosRequestConfig 
} from 'axios'
import type { AuthTokens } from '@/stores/auth-store'

// Get API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

// Interface para el store de autenticación
interface AuthStore {
  getState: () => {
    tokens: AuthTokens | null
    setTokens: (tokens: AuthTokens) => void
    clearAuth: () => void
    isAuthenticated: boolean
  }
}

/**
 * Token Manager
 * Maneja el almacenamiento, recuperación y refresco de tokens JWT
 */
export class TokenManager {
  private authStore: AuthStore | null = null
  private refreshPromise: Promise<AuthTokens> | null = null

  /**
   * Configura el store de autenticación
   */
  setAuthStore(store: AuthStore) {
    this.authStore = store
  }

  /**
   * Obtiene el token de acceso actual
   */
  getAccessToken(): string | null {
    return this.authStore?.getState().tokens?.access_token || null
  }

  /**
   * Obtiene el token de refresco actual
   */
  getRefreshToken(): string | null {
    return this.authStore?.getState().tokens?.refresh_token || null
  }

  /**
   * Guarda los tokens en el store
   */
  setTokens(tokens: AuthTokens) {
    this.authStore?.getState().setTokens(tokens)
  }

  /**
   * Elimina los tokens del almacenamiento
   */
  clearTokens() {
    this.authStore?.getState().clearAuth()
    this.refreshPromise = null
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.authStore?.getState().isAuthenticated || false
  }

  /**
   * Refresca el token de acceso usando el refresh token
   * Implementa un mecanismo para evitar múltiples llamadas simultáneas
   */
  async refreshAccessToken(): Promise<AuthTokens> {
    // Si ya hay un refresh en progreso, retornar esa promesa
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      this.clearTokens()
      throw new Error('No refresh token available')
    }

    // Crear nueva promesa de refresh
    this.refreshPromise = (async () => {
      try {
        const response = await axios.post<AuthTokens>(
          `${API_BASE_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        )
        
        const newTokens = response.data
        this.setTokens(newTokens)
        
        return newTokens
      } catch (error) {
        // Si el refresh falla, limpiar tokens y lanzar error
        this.clearTokens()
        throw error
      } finally {
        // Limpiar la promesa después de completarse
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  /**
   * Verifica si el token está próximo a expirar (menos de 5 minutos)
   */
  isTokenExpiringSoon(): boolean {
    const tokens = this.authStore?.getState().tokens
    if (!tokens?.expires_in) return false

    // Considerar que expira si quedan menos de 5 minutos
    const EXPIRATION_THRESHOLD = 5 * 60 // 5 minutos en segundos
    return tokens.expires_in < EXPIRATION_THRESHOLD
  }
}

// Instancia singleton del token manager
export const tokenManager = new TokenManager()

/**
 * API Client
 * Cliente Axios configurado con interceptores para autenticación
 */
class APIClient {
  private client: AxiosInstance
  private isRefreshing = false
  private failedRequestsQueue: Array<{
    resolve: (token: string) => void
    reject: (error: Error) => void
  }> = []

  constructor() {
    // Crear instancia de Axios
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000, // 30 segundos
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.setupRequestInterceptor()
    this.setupResponseInterceptor()
  }

  /**
   * Interceptor de Request
   * Añade el token de autenticación a todas las peticiones
   */
  private setupRequestInterceptor() {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // No añadir token a endpoints públicos
        const publicEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password']
        const isPublicEndpoint = publicEndpoints.some(endpoint => 
          config.url?.includes(endpoint)
        )

        if (!isPublicEndpoint) {
          const token = tokenManager.getAccessToken()
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }

          // Refrescar token si está próximo a expirar
          if (tokenManager.isTokenExpiringSoon() && !this.isRefreshing) {
            try {
              this.isRefreshing = true
              const newTokens = await tokenManager.refreshAccessToken()
              config.headers.Authorization = `Bearer ${newTokens.access_token}`
            } catch (error) {
              console.error('Failed to refresh token proactively:', error)
            } finally {
              this.isRefreshing = false
            }
          }
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  /**
   * Interceptor de Response
   * Maneja errores de autenticación y refresca tokens expirados
   */
  private setupResponseInterceptor() {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Si el error no es 401 o ya intentamos refrescar, rechazar
        if (error.response?.status !== 401 || originalRequest._retry) {
          return Promise.reject(error)
        }

        // Marcar que ya intentamos refrescar este request
        originalRequest._retry = true

        // Si no estamos refrescando, iniciar el proceso
        if (!this.isRefreshing) {
          this.isRefreshing = true

          try {
            const newTokens = await tokenManager.refreshAccessToken()
            
            // Procesar todas las peticiones en cola
            this.failedRequestsQueue.forEach(({ resolve }) => {
              resolve(newTokens.access_token)
            })
            this.failedRequestsQueue = []

            // Reintentar la petición original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`
            return this.client(originalRequest)
          } catch (refreshError) {
            // Si falla el refresh, rechazar todas las peticiones en cola
            this.failedRequestsQueue.forEach(({ reject }) => {
              reject(new Error('Failed to refresh token'))
            })
            this.failedRequestsQueue = []
            
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        // Si ya estamos refrescando, añadir esta petición a la cola
        return new Promise((resolve, reject) => {
          this.failedRequestsQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(this.client(originalRequest))
            },
            reject: (error: Error) => {
              reject(error)
            }
          })
        })
      }
    )
  }

  /**
   * Método GET
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  /**
   * Método POST
   */
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  /**
   * Método PUT
   */
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  /**
   * Método PATCH
   */
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config)
  }

  /**
   * Método DELETE
   */
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config)
  }

  /**
   * Obtiene la instancia raw de Axios (para casos especiales)
   */
  getAxiosInstance(): AxiosInstance {
    return this.client
  }
}

// Exportar instancia singleton del API client
const apiClient = new APIClient()
export default apiClient

// También exportar como named export
export { apiClient }

/**
 * Función para configurar el auth store en el token manager
 * Debe ser llamada durante la inicialización de la aplicación
 */
export function setAuthStore(store: AuthStore) {
  tokenManager.setAuthStore(store)
}
