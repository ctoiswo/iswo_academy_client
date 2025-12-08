import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationService, type Notification } from '@/services/notification-service'
import { useAuthStore } from '@/stores/auth-store'

interface UseNotificationsListOptions {
  page?: number
  per_page?: number
  filter?: 'unread' | 'read' | 'all'
  category?: string
  enabled?: boolean
}

/**
 * Hook para obtener la lista de notificaciones con paginación
 */
export function useNotificationsList(options: UseNotificationsListOptions = {}) {
  const { currentAcademy } = useAuthStore()
  const { enabled = true, ...params } = options

  return useQuery({
    queryKey: ['notifications', 'list', currentAcademy?.id, params],
    queryFn: () => notificationService.getNotifications(params),
    enabled,
    staleTime: 30000, // 30 segundos
  })
}

/**
 * Hook para obtener solo notificaciones no leídas
 */
export function useUnreadNotifications(enabled = true) {
  const { currentAcademy } = useAuthStore()

  return useQuery({
    queryKey: ['notifications', 'unread', currentAcademy?.id],
    queryFn: () => notificationService.getUnreadNotifications(),
    enabled,
    refetchInterval: 60000, // Refetch cada 60 segundos
    staleTime: 30000,
  })
}

/**
 * Hook para obtener una notificación específica
 */
export function useNotification(id: number, enabled = true) {
  return useQuery({
    queryKey: ['notifications', 'detail', id],
    queryFn: () => notificationService.getNotification(id),
    enabled: enabled && !!id,
  })
}

/**
 * Hook para obtener estadísticas de notificaciones
 */
export function useNotificationStats(enabled = true) {
  const { currentAcademy } = useAuthStore()

  return useQuery({
    queryKey: ['notifications', 'stats', currentAcademy?.id],
    queryFn: () => notificationService.getStats(currentAcademy?.id),
    enabled,
    staleTime: 60000, // 1 minuto
  })
}

/**
 * Hook para marcar una notificación como leída
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient()
  const { currentAcademy } = useAuthStore()

  return useMutation({
    mutationFn: (notificationId: number) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread', currentAcademy?.id] })
      queryClient.invalidateQueries({ queryKey: ['notifications', 'stats'] })
    },
  })
}

/**
 * Hook para marcar todas como leídas
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient()
  const { currentAcademy } = useAuthStore()

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(currentAcademy?.id),
    onSuccess: () => {
      // Invalidar todas las queries de notificaciones
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Hook para archivar una notificación
 */
export function useArchiveNotification() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: number) => notificationService.archiveNotification(notificationId),
    onSuccess: () => {
      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

/**
 * Hook optimista para marcar como leída localmente
 */
export function useOptimisticMarkAsRead() {
  const queryClient = useQueryClient()
  const { currentAcademy } = useAuthStore()

  return (notificationId: number) => {
    // Actualizar el cache optimísticamente
    queryClient.setQueryData(
      ['notifications', 'list', currentAcademy?.id],
      (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((n: Notification) =>
            n.id === notificationId ? { ...n, read: true, read_at: new Date().toISOString() } : n
          ),
          meta: {
            ...old.meta,
            unread_count: Math.max(0, old.meta.unread_count - 1),
          },
        }
      }
    )

    // Actualizar unread notifications
    queryClient.setQueryData(
      ['notifications', 'unread', currentAcademy?.id],
      (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.filter((n: Notification) => n.id !== notificationId),
          meta: {
            count: Math.max(0, old.meta.count - 1),
          },
        }
      }
    )

    // Llamar al API en segundo plano
    notificationService.markAsRead(notificationId).catch(() => {
      // Si falla, revertir
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    })
  }
}
