import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { AcademyMembership } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import {
  LoadingSpinner,
  PageHeader,
  AcademyGrid,
  EmptyState,
  PageFooter,
} from './components'
import { Footer, Navbar } from '@/components'
import { Particles } from '@/components/ui/particles'

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
    } catch (_error) {
      // console.error('Failed to select academy:', error)
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
    <div className='relative min-h-screen flex flex-col bg-background'>
      <Particles
        className='absolute inset-0 z-0 pointer-events-none'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />
      <Navbar />
      <main className='relative z-10 flex-1 container mx-auto max-w-7xl px-4 py-16'>
        <PageHeader userName={user.first_name} />

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
      </main>
      <Footer />
    </div>
  )
}

export type { AcademyMembership, AcademyData } from '@/types'
