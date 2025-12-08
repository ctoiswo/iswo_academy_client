import { useState, useEffect } from 'react'
import {
  superAdminApi,
  type GlobalStats,
  type AcademyOverview,
} from '@/lib/api-client'
import type { DashboardProps } from '@/components/dashboard-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AcademyManagementPanel } from './components/academy-management-panel'
import { GlobalStatsOverview } from './components/global-stats-overview'

// Re-export types for component use
export type { GlobalStats, AcademyOverview }

export function SuperAdminDashboard({ user, academy }: DashboardProps) {
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [academies, setAcademies] = useState<AcademyOverview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load real data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Load global statistics and academies in parallel
        const [statsResponse, academiesResponse] = await Promise.all([
          superAdminApi.getGlobalStats(),
          superAdminApi.getAcademies({ per_page: 50 }), // Load first 50 academies
        ])

        setGlobalStats(statsResponse)
        setAcademies(academiesResponse.data)
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to load dashboard data'
        setError(errorMessage)
        // console.error('Dashboard loading error:', err)

        // Fallback to mock data in development if API fails
        if (import.meta.env.DEV) {
          // console.warn('API failed, using mock data for development')
          const mockStats: GlobalStats = {
            totalAcademies: 12,
            totalUsers: 1247,
            totalCourses: 89,
            totalRevenue: 45230,
            monthlyGrowth: {
              academies: 8.2,
              users: 15.3,
              revenue: 12.7,
            },
          }

          const mockAcademies: AcademyOverview[] = [
            {
              id: 1,
              name: 'Tech Academy',
              description: 'Leading technology education platform',
              logo_url: null,
              total_users: 324,
              total_courses: 25,
              total_revenue: 15420,
              created_at: '2024-01-15T10:00:00Z',
              status: 'active',
              creator: {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
              },
            },
            {
              id: 2,
              name: 'Business School',
              description: 'Professional business training',
              logo_url: null,
              total_users: 198,
              total_courses: 18,
              total_revenue: 12350,
              created_at: '2024-02-01T14:30:00Z',
              status: 'active',
              creator: {
                id: 2,
                name: 'Jane Smith',
                email: 'jane@example.com',
              },
            },
            {
              id: 3,
              name: 'Design Institute',
              description: 'Creative design and arts education',
              logo_url: null,
              total_users: 156,
              total_courses: 12,
              total_revenue: 8940,
              created_at: '2024-02-20T09:15:00Z',
              status: 'inactive',
              creator: {
                id: 3,
                name: 'Bob Johnson',
                email: 'bob@example.com',
              },
            },
          ]

          setGlobalStats(mockStats)
          setAcademies(mockAcademies)
          setError(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (!user) return null

  return (
    <DashboardLayout
      user={user}
      academy={academy}
      variant='full'
      dashboardType='super-admin'
    >
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Super Admin Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Manage all academies and system-wide settings
          </p>
        </div>

        {/* Global Statistics Overview */}
        <GlobalStatsOverview
          stats={globalStats}
          loading={isLoading}
          error={error}
        />

        {/* Academy Management Panel */}
        <AcademyManagementPanel
          academies={academies}
          loading={isLoading}
          error={error}
        />
      </div>
    </DashboardLayout>
  )
}
