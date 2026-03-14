import { useEffect, useState, useCallback, useRef } from 'react'
import { createConsumer } from '@rails/actioncable'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

interface Notification {
  id: number
  notification_type: string
  category: string
  priority: number
  title: string
  body: string
  action_url?: string
  action_text?: string
  read: boolean
  read_at?: string
  created_at: string
  actor?: {
    id: number
    full_name: string
    avatar_url?: string
  }
  notifiable?: any
  metadata?: any
}

interface UseNotificationsOptions {
  enabled?: boolean
  autoConnect?: boolean
  showToasts?: boolean
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { enabled = true, autoConnect = true, showToasts = true } = options
  const { isAuthenticated, tokens, currentAcademy } = useAuthStore()
  const { t } = useTranslation()

  // Estados del hook
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Referencias para WebSocket
  const consumerRef = useRef<any>(null)
  const subscriptionRef = useRef<any>(null)

  // Manejar nueva notificación recibida
  const handleNewNotification = useCallback(
    (data: any) => {
      const newNotification = data.notification
      if (!newNotification) {
        return
      }

      // Agregar notificación al estado
      setNotifications((prev) => [newNotification, ...prev])
      setUnreadCount((prev) => prev + 1)

      // Mostrar toast si está habilitado
      if (showToasts) {
        const emoji = getCategoryEmoji(
          newNotification.category,
          newNotification.type || newNotification.notification_type
        )
        const notifiableName =
          newNotification.notifiable?.title ||
          newNotification.actor?.full_name ||
          ''
        const message = t(
          `notifications.${newNotification.notification_type}.title`,
          {
            name: notifiableName,
            defaultValue: newNotification.title,
          }
        )
        const duration = getPriorityDuration(newNotification.priority)

        if (newNotification.priority >= 3) {
          toast.success(`${emoji} ${message}`, { duration })
        } else {
          toast.info(`${emoji} ${message}`, { duration })
        }
      }
    },
    [showToasts]
  )

  // Obtener emoji por categoría
  const getCategoryEmoji = (category: string, type?: string) => {
    switch (category) {
      case 'academic':
        if (type?.includes('assignment')) return '📋'
        if (type?.includes('lesson')) return '📚'
        if (type?.includes('certificate')) return '🎓'
        if (type?.includes('course')) return '📖'
        return '📚'
      case 'social':
        return '💬'
      case 'administrative':
        return '📢'
      case 'system':
        return '⚙️'
      default:
        return '🔔'
    }
  }

  // Obtener duración del toast por prioridad
  const getPriorityDuration = (priority: number) => {
    switch (priority) {
      case 4:
        return 8000 // Crítica - 8s
      case 3:
        return 5000 // Alta - 5s
      case 2:
        return 4000 // Normal - 4s
      case 1:
        return 3000 // Baja - 3s
      default:
        return 4000
    }
  }

  // Manejar otros mensajes WebSocket
  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.action) {
      case 'notification_read':
        // Marcar como leída localmente
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === data.notification_id
              ? { ...notif, read: true, read_at: data.read_at }
              : notif
          )
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
        break

      case 'unread_notifications':
        // Cargar notificaciones no leídas
        setNotifications(data.data || [])
        setUnreadCount(data.count || 0)
        break

      case 'error':
        // console.error('NotificationsChannel error:', data.message)
        setConnectionError(data.message)
        break

      default:
    }
  }, [])

  // Cargar notificaciones no leídas desde el API
  const loadUnreadNotifications = useCallback(async () => {
    if (!isAuthenticated || !tokens?.access_token || !currentAcademy) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/notifications/unread`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
            'X-Academy-Slug': currentAcademy.slug,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.data || [])
        setUnreadCount(data.meta?.count || 0)
      }
    } catch (_error) {
      // console.error('Failed to load notifications:', error)
      setConnectionError('Failed to load notifications')
    }
  }, [isAuthenticated, tokens, currentAcademy])

  // Marcar notificación como leída
  const markAsRead = useCallback(
    async (notificationId: number) => {
      if (!tokens?.access_token || !currentAcademy) return

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/notifications/${notificationId}/mark_as_read`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'Content-Type': 'application/json',
              'X-Academy-Slug': currentAcademy.slug,
            },
          }
        )

        if (response.ok) {
          // El WebSocket nos notificará del cambio
        }
      } catch (_error) {
        // console.error('Failed to mark notification as read:', error)
      }
    },
    [tokens, currentAcademy]
  )

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    // Marcar localmente primero para UX inmediato
    notifications
      .filter((n) => !n.read)
      .forEach((notification) => {
        markAsRead(notification.id)
      })
  }, [notifications, markAsRead])

  // Conexión WebSocket
  useEffect(() => {
    if (!enabled || !autoConnect || !isAuthenticated || !tokens?.access_token) {
      return
    }

    const connectWebSocket = () => {
      try {
        const wsUrl =
          import.meta.env.VITE_CABLE_URL ||
          (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1')
            .replace(/^http/, 'ws')
            .replace('/api/v1', '') + '/cable'

        consumerRef.current = createConsumer(
          `${wsUrl}?token=${tokens.access_token}`
        )

        subscriptionRef.current = consumerRef.current.subscriptions.create(
          { channel: 'NotificationsChannel' },
          {
            connected() {
              setIsConnected(true)
              setConnectionError(null)

              // Cargar notificaciones no leídas al conectar
              loadUnreadNotifications()
            },

            disconnected() {
              setIsConnected(false)
            },

            received(data: any) {
              if (
                data.type === 'notification_created' ||
                data.type === 'new_notification'
              ) {
                handleNewNotification(data)
              } else {
                handleWebSocketMessage(data)
              }
            },
          }
        )
      } catch (_error) {
        // console.error('WebSocket connection failed:', error)
        setConnectionError('Connection failed')
      }
    }

    connectWebSocket()

    // Cleanup al desmontar
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
      if (consumerRef.current) {
        consumerRef.current.disconnect()
      }
      setIsConnected(false)
    }
  }, [
    enabled,
    autoConnect,
    isAuthenticated,
    tokens?.access_token,
    currentAcademy?.id,
    loadUnreadNotifications,
    handleNewNotification,
    handleWebSocketMessage,
  ])

  return {
    // Estados
    notifications,
    unreadCount,
    isConnected,
    connectionError,

    // Acciones
    markAsRead,
    markAllAsRead,
    loadUnreadNotifications,

    // Utilidades
    hasUnread: unreadCount > 0,
  }
}
