import { useEffect, useState, useCallback } from 'react'
import gamificationService, { type UserBadge } from '@/services/gamification-service'
import { useAuthStore } from '@/stores/auth-store'

interface UseBadgeNotificationsOptions {
  checkInterval?: number // in milliseconds, default 30000 (30 seconds)
  checkOnMount?: boolean
  checkOnRouteChange?: boolean
}

export function useBadgeNotifications(options: UseBadgeNotificationsOptions = {}) {
  const {
    checkInterval = 30000,
    checkOnMount = true,
    checkOnRouteChange = false,
  } = options

  const { isAuthenticated, user } = useAuthStore()
  const [newBadges, setNewBadges] = useState<UserBadge[]>([])
  const [currentBadge, setCurrentBadge] = useState<UserBadge | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkForNewBadges = useCallback(async () => {
    if (!isAuthenticated || !user) {
      return
    }

    try {
      setIsChecking(true)
      const unviewedBadges = await gamificationService.checkNewBadges()

      if (unviewedBadges.length > 0) {
        console.log('Found new badges:', unviewedBadges)
        setNewBadges(unviewedBadges)

        // Show the first badge
        if (!currentBadge) {
          setCurrentBadge(unviewedBadges[0])
        }
      }
    } catch (error) {
      console.error('Error checking for new badges:', error)
    } finally {
      setIsChecking(false)
    }
  }, [isAuthenticated, user, currentBadge])

  const showNextBadge = useCallback(() => {
    if (newBadges.length === 0) {
      setCurrentBadge(null)
      return
    }

    // Remove the current badge from the list
    const remainingBadges = newBadges.filter(
      (badge) => badge.id !== currentBadge?.id
    )
    setNewBadges(remainingBadges)

    // Show the next badge or close if no more badges
    if (remainingBadges.length > 0) {
      setCurrentBadge(remainingBadges[0])
    } else {
      setCurrentBadge(null)
    }
  }, [newBadges, currentBadge])

  const dismissCurrentBadge = useCallback(() => {
    if (currentBadge) {
      // Mark as viewed (implement backend endpoint if needed)
      gamificationService.markBadgesAsViewed([currentBadge.badge.id])
    }
    showNextBadge()
  }, [currentBadge, showNextBadge])

  const dismissAllBadges = useCallback(() => {
    if (newBadges.length > 0) {
      const badgeIds = newBadges.map((badge) => badge.badge.id)
      gamificationService.markBadgesAsViewed(badgeIds)
    }
    setNewBadges([])
    setCurrentBadge(null)
  }, [newBadges])

  // Check on mount
  useEffect(() => {
    if (checkOnMount) {
      checkForNewBadges()
    }
  }, [checkOnMount, checkForNewBadges])

  // Check periodically
  useEffect(() => {
    if (!isAuthenticated || checkInterval <= 0) {
      return
    }

    const intervalId = setInterval(checkForNewBadges, checkInterval)
    return () => clearInterval(intervalId)
  }, [isAuthenticated, checkInterval, checkForNewBadges])

  // Check on route change (if enabled)
  useEffect(() => {
    if (!checkOnRouteChange) {
      return
    }

    // Listen to route changes (works with TanStack Router)
    const handleRouteChange = () => {
      checkForNewBadges()
    }

    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [checkOnRouteChange, checkForNewBadges])

  return {
    currentBadge,
    newBadges,
    hasNewBadges: newBadges.length > 0,
    badgeCount: newBadges.length,
    isChecking,
    checkForNewBadges,
    dismissCurrentBadge,
    dismissAllBadges,
    showNextBadge,
  }
}
