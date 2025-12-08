import { useEffect } from 'react'
import { toast } from 'sonner'
import { BadgeModal } from '@/components/gamification/badge-modal'
import { useBadgeNotifications } from '@/hooks/use-badge-notifications'
import { useNotifications } from '@/hooks/use-notifications'

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
  showToasts = true
}: NotificationProviderProps) {
  
  // Hook de notificaciones generales
  const {
    isConnected: notificationsConnected,
    connectionError: notificationsError
  } = useNotifications({ 
    enabled, 
    showToasts 
  })

  // Hook de notificaciones de badges
  const {
    currentBadge,
    isConnected: badgeConnected,
    dismissCurrentBadge
  } = useBadgeNotifications({ 
    enabled 
  })

  // Toast para estado de conexión
  useEffect(() => {
    if (!showToasts) return

    if (notificationsConnected && badgeConnected) {
      toast.success('✅ Conectado a notificaciones')
    } else if (notificationsError) {
      toast.error(`❌ Error de notificaciones: ${notificationsError}`)
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