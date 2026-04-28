import { type ApiError } from './api-client'

/**
 * Maps de códigos de error del backend a mensajes amigables en español
 */
const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  INVALID_CREDENTIALS:
    'Correo electrónico o contraseña incorrectos. Por favor verifica tus credenciales.',
  ACCOUNT_NOT_CONFIRMED:
    'Por favor revisa tu correo electrónico y confirma tu cuenta antes de continuar.',
  ACCOUNT_LOCKED:
    'Tu cuenta ha sido bloqueada. Por favor contacta a soporte para más información.',
  TOKEN_EXPIRED: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
  TOKEN_INVALID:
    'Token de autenticación inválido. Por favor inicia sesión nuevamente.',
  TOKEN_REVOKED:
    'Tu sesión ha sido revocada. Por favor inicia sesión nuevamente.',
  MISSING_TOKEN:
    'No se encontró token de autenticación. Por favor inicia sesión.',

  // Authorization errors
  UNAUTHORIZED: 'No tienes permiso para realizar esta acción.',
  FORBIDDEN: 'Acceso denegado. No tienes los permisos necesarios.',
  INSUFFICIENT_PERMISSIONS:
    'No tienes los permisos suficientes para esta acción.',

  // Validation errors
  VALIDATION_ERROR: 'Por favor verifica los datos ingresados.',
  INVALID_INPUT: 'Los datos proporcionados no son válidos.',
  MISSING_PARAMETER: 'Faltan parámetros requeridos.',
  RECORD_INVALID: 'Por favor verifica los datos ingresados.',

  // Resource errors
  RESOURCE_NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  RECORD_NOT_FOUND: 'El registro solicitado no existe.',
  ACADEMY_NOT_FOUND: 'La academia no fue encontrada.',
  COURSE_NOT_FOUND: 'El curso no fue encontrado.',
  USER_NOT_FOUND: 'El usuario no fue encontrado.',

  // Business logic errors
  ALREADY_ENROLLED: 'Ya estás inscrito en este curso.',
  ENROLLMENT_CLOSED: 'Las inscripciones para este curso están cerradas.',
  COURSE_FULL: 'El curso ha alcanzado su capacidad máxima.',
  INSUFFICIENT_BALANCE: 'Saldo insuficiente para completar la transacción.',
  PAYMENT_REQUIRED: 'Se requiere un pago para acceder a este contenido.',

  // Rate limiting
  RATE_LIMIT_EXCEEDED:
    'Has excedido el límite de solicitudes. Por favor intenta más tarde.',
  TOO_MANY_ATTEMPTS:
    'Demasiados intentos. Por favor espera unos minutos antes de intentar nuevamente.',

  // Network errors
  NETWORK_ERROR:
    'Error de conexión. Por favor verifica tu conexión a internet.',
  TIMEOUT_ERROR:
    'La solicitud tardó demasiado tiempo. Por favor intenta nuevamente.',
  SERVER_ERROR: 'Error del servidor. Por favor intenta más tarde.',

  // Payment errors
  PAYMENT_FAILED:
    'El pago no pudo ser procesado. Por favor intenta nuevamente.',
  INVALID_PAYMENT_METHOD: 'Método de pago inválido.',
  CARD_DECLINED: 'Tu tarjeta fue rechazada. Por favor verifica los datos.',

  // Default
  UNKNOWN_ERROR: 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
}

/**
 * Obtiene un mensaje de error amigable para mostrar al usuario
 * Prioridad: user_message del backend > mensaje específico del código > mensaje genérico
 */
export function getErrorMessage(error: ApiError | Error | unknown): string {
  // Si es un ApiError del backend
  if (error && typeof error === 'object' && 'code' in error) {
    const apiError = error as ApiError

    // 1. Prioridad: user_message del backend (ya viene traducido)
    if (apiError.user_message) {
      return apiError.user_message
    }

    // 2. Si hay código, buscar mensaje en el mapa
    if (apiError.code && ERROR_MESSAGES[apiError.code]) {
      return ERROR_MESSAGES[apiError.code]
    }

    // 3. Si hay mensaje del servidor, usarlo
    if (apiError.message) {
      return apiError.message
    }
  }

  // Si es un Error estándar de JavaScript
  if (error instanceof Error && error.message) {
    return error.message
  }

  // Fallback genérico
  return ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Determina si un error requiere cerrar sesión
 */
export function shouldLogout(error: ApiError | unknown): boolean {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false
  }

  const apiError = error as ApiError
  const logoutCodes = [
    'TOKEN_EXPIRED',
    'TOKEN_INVALID',
    'TOKEN_REVOKED',
    'ACCOUNT_LOCKED',
  ]

  return logoutCodes.includes(apiError.code || '')
}

/**
 * Determina si un error es de validación de campos
 */
export function isValidationError(error: ApiError | unknown): boolean {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return false
  }

  const apiError = error as ApiError
  return (
    apiError.code === 'VALIDATION_ERROR' ||
    apiError.code === 'INVALID_INPUT' ||
    apiError.code === 'RECORD_INVALID'
  )
}

/**
 * Extrae detalles de validación del error para asignar a campos específicos
 */
export function getValidationDetails(error: ApiError): Record<string, string> {
  const details: Record<string, string> = {}

  if (!error.details || typeof error.details !== 'object') {
    return details
  }

  // Si details es un array de strings
  if (Array.isArray(error.details)) {
    error.details.forEach((detail: string) => {
      const lower = detail.toLowerCase()
      if (lower.includes('email')) {
        details.email = detail
      } else if (lower.includes('password') || lower.includes('contraseña')) {
        details.password = detail
      } else if (lower.includes('name') || lower.includes('nombre')) {
        details.name = detail
      }
    })
  }
  // Si details es un objeto con campos específicos
  else if (typeof error.details === 'object') {
    // Manejar formato { errors: { email: [...], password: [...] } } de ActiveRecord
    const source =
      'errors' in (error.details as object) &&
      typeof (error.details as Record<string, unknown>).errors === 'object'
        ? ((error.details as Record<string, unknown>).errors as Record<
            string,
            unknown
          >)
        : (error.details as Record<string, unknown>)

    Object.entries(source).forEach(([key, value]) => {
      if (typeof value === 'string') {
        details[key] = value
      } else if (Array.isArray(value)) {
        details[key] = value.join(', ')
      }
    })
  }

  return details
}

/**
 * Tipo de severidad del error para UI
 */
export type ErrorSeverity = 'error' | 'warning' | 'info'

/**
 * Obtiene la severidad del error para determinar el tipo de notificación
 */
export function getErrorSeverity(error: ApiError | unknown): ErrorSeverity {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return 'error'
  }

  const apiError = error as ApiError

  // Errores de información (no críticos)
  const infoErrors = ['ALREADY_ENROLLED', 'ENROLLMENT_CLOSED']
  if (apiError.code && infoErrors.includes(apiError.code)) {
    return 'info'
  }

  // Warnings (requieren atención pero no son errores críticos)
  const warningErrors = [
    'RATE_LIMIT_EXCEEDED',
    'TOO_MANY_ATTEMPTS',
    'COURSE_FULL',
    'ACCOUNT_NOT_CONFIRMED',
  ]
  if (apiError.code && warningErrors.includes(apiError.code)) {
    return 'warning'
  }

  // Por defecto es error
  return 'error'
}
