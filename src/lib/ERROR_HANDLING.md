# Sistema Centralizado de Manejo de Errores

## 📋 Descripción General

Este sistema centraliza el manejo de errores en la aplicación, eliminando la necesidad de código duplicado (switch-case) en cada formulario. Se integra perfectamente con el sistema de errores personalizado del backend.

## 🏗️ Arquitectura

```
Backend (Rails)                    Frontend (React)
┌─────────────────────┐           ┌─────────────────────┐
│ ApplicationError    │           │ ApiError Interface  │
│  - code             │──────────▶│  - code             │
│  - user_message     │           │  - user_message     │
│  - status           │           │  - message          │
│  - details          │           │  - details          │
│  - metadata         │           │  - status           │
└─────────────────────┘           └─────────────────────┘
                                           │
                                           ▼
                                  ┌─────────────────────┐
                                  │ error-handler.ts    │
                                  │  - getErrorMessage  │
                                  │  - shouldLogout     │
                                  │  - isValidation     │
                                  │  - getValidation    │
                                  └─────────────────────┘
```

## 📚 API del Error Handler

### `getErrorMessage(error: unknown): string`

Obtiene un mensaje de error amigable para mostrar al usuario.

**Prioridad:**

1. `user_message` del backend (ya viene traducido)
2. Mensaje específico del código de error
3. Mensaje del servidor
4. Mensaje genérico de fallback

**Ejemplo:**

```typescript
try {
  await login(email, password)
} catch (error) {
  const message = getErrorMessage(error)
  toast.error(message) // "Correo electrónico o contraseña incorrectos..."
}
```

### `isValidationError(error: unknown): boolean`

Determina si un error es de validación de campos.

**Ejemplo:**

```typescript
if (isValidationError(error)) {
  // Mostrar errores en campos específicos
}
```

### `getValidationDetails(error: ApiError): Record<string, string>`

Extrae detalles de validación para asignar a campos específicos.

**Ejemplo:**

```typescript
const validationDetails = getValidationDetails(error)
// { email: "El email ya está en uso", password: "Debe tener al menos 8 caracteres" }

Object.entries(validationDetails).forEach(([field, message]) => {
  form.setError(field, { message })
})
```

### `shouldLogout(error: unknown): boolean`

Determina si un error requiere cerrar la sesión del usuario.

**Códigos que requieren logout:**

- `TOKEN_EXPIRED`
- `TOKEN_INVALID`
- `TOKEN_REVOKED`
- `ACCOUNT_LOCKED`

**Ejemplo:**

```typescript
if (shouldLogout(error)) {
  logout()
  navigate('/sign-in')
}
```

### `getErrorSeverity(error: unknown): ErrorSeverity`

Obtiene la severidad del error para determinar el tipo de notificación.

**Valores:**

- `'error'` - Errores críticos (default)
- `'warning'` - Requiere atención pero no crítico
- `'info'` - Información, no es un error real

**Ejemplo:**

```typescript
const severity = getErrorSeverity(error)
if (severity === 'error') {
  toast.error(message)
} else if (severity === 'warning') {
  toast.warning(message)
}
```

## 🎯 Uso en Formularios

### Antes (Código Duplicado)

```typescript
catch (error: any) {
  let errorMessage = 'Error al iniciar sesión'

  if (isApiError(error)) {
    switch (error.code) {
      case 'INVALID_CREDENTIALS':
        errorMessage = 'Correo o contraseña incorrectos...'
        break
      case 'ACCOUNT_NOT_CONFIRMED':
        errorMessage = 'Por favor confirma tu cuenta...'
        break
      case 'ACCOUNT_LOCKED':
        errorMessage = 'Tu cuenta ha sido bloqueada...'
        break
      // ... más casos
    }
  }

  toast.error(errorMessage)

  // Más lógica duplicada para validación...
}
```

### Después (Centralizado)

```typescript
catch (error: unknown) {
  const errorMessage = getErrorMessage(error)
  toast.error(errorMessage)

  // Manejar errores de validación
  if (isApiError(error) && isValidationError(error)) {
    const validationDetails = getValidationDetails(error)
    Object.entries(validationDetails).forEach(([field, message]) => {
      form.setError(field, { message })
    })
  }

  // Auto-logout si es necesario
  if (shouldLogout(error)) {
    logout()
  }
}
```

## 🔍 Códigos de Error Soportados

### Autenticación

- `INVALID_CREDENTIALS` - Credenciales incorrectas
- `ACCOUNT_NOT_CONFIRMED` - Cuenta no confirmada
- `ACCOUNT_LOCKED` - Cuenta bloqueada
- `TOKEN_EXPIRED` - Token expirado
- `TOKEN_INVALID` - Token inválido
- `TOKEN_REVOKED` - Token revocado
- `MISSING_TOKEN` - Token no encontrado

### Autorización

- `UNAUTHORIZED` - No autorizado
- `FORBIDDEN` - Acceso denegado
- `INSUFFICIENT_PERMISSIONS` - Permisos insuficientes

### Validación

- `VALIDATION_ERROR` - Error de validación
- `INVALID_INPUT` - Entrada inválida
- `MISSING_PARAMETER` - Parámetro faltante

### Recursos

- `RESOURCE_NOT_FOUND` - Recurso no encontrado
- `RECORD_NOT_FOUND` - Registro no existe
- `ACADEMY_NOT_FOUND` - Academia no encontrada
- `COURSE_NOT_FOUND` - Curso no encontrado
- `USER_NOT_FOUND` - Usuario no encontrado

### Lógica de Negocio

- `ALREADY_ENROLLED` - Ya inscrito
- `ENROLLMENT_CLOSED` - Inscripción cerrada
- `COURSE_FULL` - Curso lleno
- `INSUFFICIENT_BALANCE` - Saldo insuficiente
- `PAYMENT_REQUIRED` - Pago requerido

### Rate Limiting

- `RATE_LIMIT_EXCEEDED` - Límite de solicitudes excedido
- `TOO_MANY_ATTEMPTS` - Demasiados intentos

### Red y Servidor

- `NETWORK_ERROR` - Error de conexión
- `TIMEOUT_ERROR` - Tiempo de espera agotado
- `SERVER_ERROR` - Error del servidor

### Pagos

- `PAYMENT_FAILED` - Pago fallido
- `INVALID_PAYMENT_METHOD` - Método de pago inválido
- `CARD_DECLINED` - Tarjeta rechazada

## 🔧 Integración con Backend

El sistema está diseñado para trabajar con la estructura de errores del backend:

```ruby
# Backend: app/errors/application_error.rb
class ApplicationError < StandardError
  def to_json_api
    {
      error: {
        type: self.class.name,
        message: message,
        user_message: user_message,
        code: code,
        status: status,
        details: details,
        metadata: metadata,
        timestamp: Time.current.iso8601
      }
    }
  end
end
```

El frontend recibe esta estructura y la procesa automáticamente:

```typescript
export interface ApiError {
  message: string
  user_message?: string // Mensaje del backend
  code?: string
  type?: string
  status?: number
  details?: string[] | Record<string, unknown>
  metadata?: Record<string, unknown>
  timestamp?: string
}
```

## ✅ Beneficios

1. **Sin Duplicación de Código**: Un solo lugar para manejar errores
2. **Consistencia**: Mensajes uniformes en toda la aplicación
3. **Mantenibilidad**: Agregar nuevos errores en un solo archivo
4. **Type Safety**: TypeScript garantiza tipado correcto
5. **Traducción Centralizada**: Mensajes en español en un solo lugar
6. **Integración con Backend**: Aprovecha `user_message` del backend
7. **Auto-logout**: Manejo automático de tokens expirados
8. **Validación Automática**: Extracción de errores por campo

## 📝 Mejoras Futuras

- [ ] Agregar internacionalización (i18n) para múltiples idiomas
- [ ] Crear React Error Boundary para errores de renderizado
- [ ] Agregar logging de errores a servicio externo (Sentry)
- [ ] Métricas de errores para análisis
- [ ] Cache de mensajes de error frecuentes
- [ ] Interceptor de Axios para manejo global

## 📖 Referencias

- `/Volumes/Oscar/work/iswo_academy/iswo_academy_core/app/errors/` - Sistema de errores del backend
- `src/lib/error-handler.ts` - Implementación del error handler
- `src/lib/api-client-base.ts` - Interfaz ApiError
