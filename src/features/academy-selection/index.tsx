import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Footer, Navbar } from '@/components'
import type { AcademyMembership } from '@/types'
import { useAuthStore } from '@/stores/auth-store'
import { Particles } from '@/components/ui/particles'
import {
  LoadingSpinner,
  PageHeader,
  AcademyGrid,
  EmptyState,
  PageFooter,
} from './components'

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
    <div className='bg-background relative flex min-h-screen flex-col'>
      <Particles
        className='pointer-events-none absolute inset-0 z-0'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />
      <Navbar />
      <main className='relative z-10 container mx-auto max-w-7xl flex-1 px-4 py-16'>
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
