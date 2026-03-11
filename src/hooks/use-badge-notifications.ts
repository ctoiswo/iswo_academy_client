import { useEffect, useState, useCallback, useRef } from 'react'
import { type UserBadge } from '@/types'
import { createConsumer } from '@rails/actioncable'
import { useAuthStore } from '@/stores/auth-store'

interface UseBadgeNotificationsOptions {
  enabled?: boolean
}

export function useBadgeNotifications(
  options: UseBadgeNotificationsOptions = {}
) {
  const { enabled = true } = options

  const { isAuthenticated, user, tokens, currentAcademy } = useAuthStore()
  const [newBadges, setNewBadges] = useState<UserBadge[]>([])
  const [currentBadge, setCurrentBadge] = useState<UserBadge | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionRef = useRef<any>(null)
  const consumerRef = useRef<any>(null)

  const handleBadgeEarned = useCallback(
    (data: any) => {
      if (data.type === 'badge_earned' && data.data) {
        const newBadge = data.data as UserBadge

        setNewBadges((prev) => [...prev, newBadge])

        // Show the badge if no badge is currently displayed
        if (!currentBadge) {
          setCurrentBadge(newBadge)
        }
      }
    },
    [currentBadge]
  )

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

  const markBadgeViewed = useCallback(
    async (badgeId: number) => {
      if (!tokens?.access_token || !currentAcademy) return

      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
        await fetch(`${apiUrl}/badges/${badgeId}/mark_viewed`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            'Content-Type': 'application/json',
            'X-Academy-Slug': currentAcademy.slug,
          },
        })
      } catch (_error) {
        // console.error('Failed to mark badge as viewed:', error)
      }
    },
    [tokens, currentAcademy]
  )

  const dismissCurrentBadge = useCallback(() => {
    if (currentBadge?.badge?.id) {
      // Mark as viewed via API
      markBadgeViewed(currentBadge.badge.id)
    }
    showNextBadge()
  }, [currentBadge, showNextBadge, markBadgeViewed])

  const dismissAllBadges = useCallback(() => {
    if (newBadges.length > 0) {
      // Mark all as viewed
      newBadges.forEach((badge) => {
        if (badge.badge?.id) {
          markBadgeViewed(badge.badge.id)
        }
      })
    }
    setNewBadges([])
    setCurrentBadge(null)
  }, [newBadges, markBadgeViewed])

  // Load unviewed badges on mount/connection
  const loadUnviewedBadges = useCallback(async () => {
    if (!isAuthenticated || !tokens?.access_token || !currentAcademy) {
      return
    }

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
      const academySlug = currentAcademy.slug

      const response = await fetch(`${apiUrl}/badges/unviewed`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          'X-Academy-Slug': academySlug,
        },
      })

      if (response.ok) {
        const data = await response.json()
        const unviewedBadges = data.data || []

        if (unviewedBadges.length > 0) {
          setNewBadges(unviewedBadges)
          setCurrentBadge(unviewedBadges[0])
        }
      } else {
        // console.error('Failed to load badges:', response.status, response.statusText)
      }
    } catch (_error) {
      // console.error('Failed to load unviewed badges:', error)
    }
  }, [isAuthenticated, tokens, currentAcademy])

  // Connect to WebSocket when authenticated and academy is selected
  useEffect(() => {
    if (
      !isAuthenticated ||
      !user ||
      !tokens?.access_token ||
      !enabled ||
      !currentAcademy
    ) {
      return
    }

    // Get WebSocket URL from environment or construct it
    // Cable endpoint is at /cable (not under /api/v1)
    const wsUrl =
      import.meta.env.VITE_CABLE_URL ||
      (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1')
        .replace(/^http/, 'ws')
        .replace('/api/v1', '') + '/cable'

    // Create ActionCable consumer with authentication
    consumerRef.current = createConsumer(
      `${wsUrl}?token=${tokens.access_token}`
    )

    // Subscribe to GamificationChannel
    subscriptionRef.current = consumerRef.current.subscriptions.create(
      { channel: 'GamificationChannel' },
      {
        connected() {
          setIsConnected(true)
          // Load any unviewed badges when connected
          loadUnviewedBadges()
        },
        disconnected() {
          setIsConnected(false)
        },
        received(data: any) {
          handleBadgeEarned(data)
        },
      }
    )

    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe()
      }
      if (consumerRef.current) {
        consumerRef.current.disconnect()
      }
      setIsConnected(false)
    }
  }, [isAuthenticated, user, tokens?.access_token, enabled, currentAcademy?.id])

  return {
    currentBadge,
    newBadges,
    hasNewBadges: newBadges.length > 0,
    badgeCount: newBadges.length,
    isConnected,
    dismissCurrentBadge,
    dismissAllBadges,
    showNextBadge,
  }
}
