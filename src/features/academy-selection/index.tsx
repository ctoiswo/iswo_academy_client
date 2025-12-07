import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import {
  LoadingSpinner,
  PageHeader,
  AcademyGrid,
  EmptyState,
  PageFooter
} from './components'
import type { AcademyMembership } from '@/types'

export function AcademySelectionPage() {
  const navigate = useNavigate()
  const { user, academyData, selectAcademy } = useAuthStore()
  const [isSelecting, setIsSelecting] = useState(false)

  const handleAcademySelect = async (academy: AcademyMembership) => {
    try {
      setIsSelecting(true)
      
      // Select academy in store
      selectAcademy(academy.id)
      
      // Navigate to authenticated dashboard
      const dashboardPath = `/academy/${academy.slug}/dashboard`
      navigate({ to: dashboardPath })
    } catch (error) {
      console.error('Failed to select academy:', error)
      // TODO: Add proper error handling with toast notifications
    } finally {
      setIsSelecting(false)
    }
  }

  // Show loading state if user data is not available
  if (!user || !academyData) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <PageHeader userName={user.first_name} />
        
        {/* Academy Grid or Empty State */}
        {academyData.count === 0 ? (
          <EmptyState />
        ) : (
          <AcademyGrid 
            academyData={academyData}
            onSelect={handleAcademySelect}
            isSelecting={isSelecting}
          />
        )}
        
        <PageFooter />
      </div>
    </div>
  )
}

export type { AcademyMembership, AcademyData } from '@/types'