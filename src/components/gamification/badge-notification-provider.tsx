import { useEffect } from 'react'
import { BadgeModal } from '@/components/gamification/badge-modal'
import { useBadgeNotifications } from '@/hooks/use-badge-notifications'

interface BadgeNotificationProviderProps {
  children?: React.ReactNode
  enabled?: boolean
}

/**
 * BadgeNotificationProvider
 * Wraps the app and automatically shows badge modals when users earn new badges via WebSocket
 * Should be placed high in the component tree, after AuthProvider
 */
export function BadgeNotificationProvider({
  children,
  enabled = true,
}: BadgeNotificationProviderProps) {
  const { currentBadge, dismissCurrentBadge, isConnected } = useBadgeNotifications({
    enabled,
  })

  // Log connection status for debugging
  useEffect(() => {
    console.log('Badge notifications WebSocket:', isConnected ? 'connected' : 'disconnected')
  }, [isConnected])

  return (
    <>
      {children}
      <BadgeModal
        badge={currentBadge}
        open={!!currentBadge}
        onClose={dismissCurrentBadge}
      />
    </>
  )
}
