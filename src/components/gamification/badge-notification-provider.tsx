import { BadgeModal } from '@/components/gamification/badge-modal'
import { useBadgeNotifications } from '@/hooks/use-badge-notifications'

interface BadgeNotificationProviderProps {
  children?: React.ReactNode
  checkInterval?: number
  checkOnMount?: boolean
  checkOnRouteChange?: boolean
}

/**
 * BadgeNotificationProvider
 * Wraps the app and automatically shows badge modals when users earn new badges
 * Should be placed high in the component tree, after AuthProvider
 */
export function BadgeNotificationProvider({
  children,
  checkInterval = 30000,
  checkOnMount = true,
  checkOnRouteChange = true,
}: BadgeNotificationProviderProps) {
  const { currentBadge, dismissCurrentBadge } = useBadgeNotifications({
    checkInterval,
    checkOnMount,
    checkOnRouteChange,
  })

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
