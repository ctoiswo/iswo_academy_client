/**
 * API Client Base
 * Cliente Axios configurado con autenticación, interceptores y manejo de tokens
 */
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { AuthTokens } from '@/stores/auth-store'
import { getLocale } from '@/stores/locale-store'
import { tokenStorage } from '@/lib/token-storage'

// Get API base URL from environment
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

// Interface para el store de autenticación
interface AuthStore {
  getState: () => {
    tokens: AuthTokens | null
    setTokens: (tokens: AuthTokens) => void
    reset: () => void
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
   * Primero intenta desde el estado en memoria, luego delega a TokenStorage
   */
  getRefreshToken(): string | null {
    // Intentar obtener desde el estado en memoria primero
    const tokenFromState = this.authStore?.getState().tokens?.refresh_token
    if (tokenFromState) {
      return tokenFromState
    }

    // Si no está en memoria, delegar a TokenStorage (fuente de verdad persistida)
    // Esto es necesario durante la inicialización cuando el estado aún está vacío
    return tokenStorage.getRefreshToken()
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
    this.authStore?.getState().reset()
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
   * Usa TokenStorage.willExpireSoon() que calcula el tiempo restante
   * correctamente desde expires_at, no desde expires_in (duración total).
   */
  isTokenExpiringSoon(): boolean {
    return tokenStorage.willExpireSoon(5 * 60 * 1000) // 5 minutos
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
  private authStore: AuthStore | null = null
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
        Accept: 'application/json',
      },
    })

    this.setupRequestInterceptor()
    this.setupResponseInterceptor()
  }

  /**
   * Configura el store de autenticación para el API client
   */
  setAuthStore(store: AuthStore) {
    this.authStore = store
  }

  /**
   * Interceptor de Request
   * Añade el token de autenticación y locale a todas las peticiones
   */
  private setupRequestInterceptor() {
    this.client.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Añadir locale header — delegado al locale store (fuente única de verdad)
        config.headers['X-Locale'] = getLocale()

        // No añadir token a endpoints públicos
        const publicEndpoints = [
          '/auth/login',
          '/auth/register',
          '/auth/forgot-password',
        ]
        const isPublicEndpoint = publicEndpoints.some((endpoint) =>
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
            } catch (_error) {
              // console.error('Failed to refresh token proactively:', error)
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
   * Extrae el objeto error del response.data para errores del backend
   */
  private setupResponseInterceptor() {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean
        }

        // PRIMERO: Verificar si es un 401 y tenemos refresh token
        // Esto debe hacerse ANTES de formatear el error para no bloquear el refresh
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          tokenManager.getRefreshToken()
        ) {
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
              // Si falla el refresh (refresh token también expiró), hacer logout
              this.failedRequestsQueue.forEach(({ reject }) => {
                reject(new Error('Session expired. Please login again.'))
              })
              this.failedRequestsQueue = []

              // Limpiar tokens y redirigir al login
              tokenManager.clearTokens()

              // Notificar al auth store para que actualice el estado y redirija
              if (this.authStore) {
                const state = this.authStore.getState()
                if (state.reset) {
                  state.reset()
                }
              }

              // Redirigir al login si estamos en el navegador
              if (typeof window !== 'undefined') {
                window.location.href = '/sign-in'
              }

              return Promise.reject(
                new Error('Session expired. Please login again.')
              )
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
              },
            })
          })
        }

        // SEGUNDO: Si no es 401 o no se pudo refrescar, formatear el error del backend
        if (error.response?.data?.error) {
          const backendError = error.response.data.error
          // Crear un nuevo error con los datos del backend
          const apiError: ApiError = {
            message: backendError.message || 'Unknown error',
            user_message: backendError.user_message,
            code: backendError.code,
            type: backendError.type,
            status: backendError.status || error.response.status,
            details: backendError.details,
            metadata: backendError.metadata,
            timestamp: backendError.timestamp,
          }
          // Reemplazar el error con nuestro ApiError
          return Promise.reject(apiError)
        }

        // TERCERO: Si no tiene formato especial, rechazar el error tal cual
        return Promise.reject(error)
      }
    )
  }

  /**
   * Método GET
   */
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config)
  }

  /**
   * Método POST
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config)
  }

  /**
   * Método PUT
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config)
  }

  /**
   * Método PATCH
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config)
  }

  /**
   * Método DELETE
   */
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
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
 * Función para configurar el auth store en el token manager y API client
 * Debe ser llamada durante la inicialización de la aplicación
 */
export function setAuthStore(store: AuthStore) {
  tokenManager.setAuthStore(store)
  apiClient.setAuthStore(store)
}

/**
 * Interfaz para errores de API
 */
export interface ApiError {
  message: string
  user_message?: string // Mensaje amigable del backend para mostrar al usuario
  code?: string
  type?: string
  status?: number
  errors?: Record<string, string[]>
  details?: string[] | Record<string, unknown>
  metadata?: Record<string, unknown>
  timestamp?: string
}

/**
 * Type guard para verificar si un error es de tipo ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  )
}

/**
 * Extrae el mensaje de error de diferentes tipos de errores
 * @deprecated Use el nuevo getErrorMessage de lib/error-handler.ts
 */
export function getErrorMessage(error: unknown): string {
  // Si es un error de Axios, extraer el ApiError del response
  if (axios.isAxiosError(error) && error.response?.data) {
    const apiError = error.response.data as ApiError

    // Priorizar user_message del backend
    if (apiError.user_message) {
      return apiError.user_message
    }

    // Si tiene mensaje normal del backend
    if (apiError.message) {
      return apiError.message
    }
  }

  // Si es nuestro ApiError custom
  if (isApiError(error)) {
    return error.user_message || error.message
  }

  // Si es un Error estándar
  if (error instanceof Error) {
    return error.message
  }

  // Fallback
  return 'Ha ocurrido un error inesperado'
}
