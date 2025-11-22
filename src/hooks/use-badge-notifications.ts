import { useEffect, useState, useCallback, useRef } from 'react'
import { type UserBadge } from '@/services/gamification-service'
import { useAuthStore } from '@/stores/auth-store'
import { createConsumer } from '@rails/actioncable'

interface UseBadgeNotificationsOptions {
  enabled?: boolean
}

export function useBadgeNotifications(options: UseBadgeNotificationsOptions = {}) {
  const { enabled = true } = options

  const { isAuthenticated, user, tokens } = useAuthStore()
  const [newBadges, setNewBadges] = useState<UserBadge[]>([])
  const [currentBadge, setCurrentBadge] = useState<UserBadge | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionRef = useRef<any>(null)
  const consumerRef = useRef<any>(null)

  const handleBadgeEarned = useCallback((data: any) => {
    console.log('Badge earned via WebSocket:', data)

    if (data.type === 'badge_earned' && data.data) {
      const newBadge = data.data as UserBadge

      setNewBadges((prev) => [...prev, newBadge])

      // Show the badge if no badge is currently displayed
      if (!currentBadge) {
        setCurrentBadge(newBadge)
      }
    }
  }, [currentBadge])

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

  const markBadgeViewed = useCallback(async (badgeId: number) => {
    if (!tokens?.access_token) return

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      await fetch(`${apiUrl}/api/v1/badges/${badgeId}/mark_viewed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Failed to mark badge as viewed:', error)
    }
  }, [tokens])

  const dismissCurrentBadge = useCallback(() => {
    if (currentBadge) {
      // Mark as viewed via API
      markBadgeViewed(currentBadge.badge_id)
    }
    showNextBadge()
  }, [currentBadge, showNextBadge, markBadgeViewed])

  const dismissAllBadges = useCallback(() => {
    if (newBadges.length > 0) {
      // Mark all as viewed
      newBadges.forEach((badge) => {
        markBadgeViewed(badge.badge_id)
      })
    }
    setNewBadges([])
    setCurrentBadge(null)
  }, [newBadges, markBadgeViewed])

  // Load unviewed badges on mount/connection
  const loadUnviewedBadges = useCallback(async () => {
    if (!isAuthenticated || !tokens?.access_token) {
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await fetch(`${apiUrl}/api/v1/badges/unviewed`, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const unviewedBadges = data.data || []

        if (unviewedBadges.length > 0) {
          console.log(`Found ${unviewedBadges.length} unviewed badges`)
          setNewBadges(unviewedBadges)
          setCurrentBadge(unviewedBadges[0])
        }
      }
    } catch (error) {
      console.error('Failed to load unviewed badges:', error)
    }
  }, [isAuthenticated, tokens])

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user || !tokens?.access_token || !enabled) {
      return
    }

    // Get WebSocket URL from environment or construct it
    const wsUrl = import.meta.env.VITE_CABLE_URL ||
      (import.meta.env.VITE_API_URL?.replace(/^http/, 'ws') + '/cable')

    console.log('Connecting to WebSocket:', wsUrl)

    // Create ActionCable consumer with authentication
    consumerRef.current = createConsumer(`${wsUrl}?token=${tokens.access_token}`)

    // Subscribe to GamificationChannel
    subscriptionRef.current = consumerRef.current.subscriptions.create(
      { channel: 'GamificationChannel' },
      {
        connected() {
          console.log('Connected to GamificationChannel')
          setIsConnected(true)
          // Load any unviewed badges when connected
          loadUnviewedBadges()
        },
        disconnected() {
          console.log('Disconnected from GamificationChannel')
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
  }, [isAuthenticated, user, tokens, enabled, handleBadgeEarned, loadUnviewedBadges])

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
