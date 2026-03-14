import { useEffect } from 'react'
import { useBadgeNotifications } from '@/hooks/use-badge-notifications'
import { useNotifications } from '@/hooks/use-notifications'
import { BadgeModal } from '@/components/gamification/badge-modal'

interface NotificationProviderProps {
  children: React.ReactNode
  enabled?: boolean
  showToasts?: boolean
}

/**
 * NotificationProvider
 * Maneja tanto las notificaciones generales como las de badges
 * Combina useNotifications y useBadgeNotifications en un solo provider
 */
export function NotificationProvider({
  children,
  enabled = true,
  showToasts = true,
}: NotificationProviderProps) {
  // Hook de notificaciones generales
  const {
    isConnected: notificationsConnected,
    connectionError: notificationsError,
  } = useNotifications({
    enabled,
    showToasts,
  })

  // Hook de notificaciones de badges
  const {
    currentBadge,
    isConnected: badgeConnected,
    dismissCurrentBadge,
  } = useBadgeNotifications({
    enabled,
  })

  // Toast para estado de conexión
  useEffect(() => {
    if (!showToasts) return

    if (notificationsConnected && badgeConnected) {
      console.log('✅ Conectado a notificaciones')
    } else if (notificationsError) {
      console.error(`❌ Error de notificaciones: ${notificationsError}`)
    }
  }, [notificationsConnected, badgeConnected, notificationsError, showToasts])

  return (
    <>
      {children}

      {/* Modal de Badge */}
      <BadgeModal
        badge={currentBadge}
        open={!!currentBadge}
        onClose={dismissCurrentBadge}
      />
    </>
  )
}
