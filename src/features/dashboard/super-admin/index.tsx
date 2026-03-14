import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  superAdminApi,
  type GlobalStats,
  type AcademyOverview,
} from '@/lib/api-client'
import type { DashboardProps } from '@/components/dashboard-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AcademyManagementPanel } from './containers/academy-management-panel'
import { GlobalStatsOverview } from './containers/global-stats-overview'
import type { AcademyStatusFilter } from './types'

// Re-export types for component use
export type { GlobalStats, AcademyOverview }

export interface AcademiesMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}

export function SuperAdminDashboard({ user, academy }: DashboardProps) {
  const { t } = useTranslation()
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [academies, setAcademies] = useState<AcademyOverview[]>([])
  const [academiesMeta, setAcademiesMeta] = useState<AcademiesMeta | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [academiesLoading, setAcademiesLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [academiesError, setAcademiesError] = useState<string | null>(null)

  // Academies filter/pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AcademyStatusFilter>('all')

  useEffect(() => {
    setStatsLoading(true)
    superAdminApi
      .getGlobalStats()
      .then(setGlobalStats)
      .catch((err) =>
        setStatsError(err?.message || 'Failed to load statistics')
      )
      .finally(() => setStatsLoading(false))
  }, [])

  const fetchAcademies = useCallback(() => {
    setAcademiesLoading(true)
    setAcademiesError(null)
    superAdminApi
      .getAcademies({
        page: currentPage,
        per_page: 10,
        search: searchTerm || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      })
      .then((res) => {
        setAcademies(res.data)
        setAcademiesMeta(res.meta ?? null)
      })
      .catch((err) =>
        setAcademiesError(err?.message || 'Failed to load academies')
      )
      .finally(() => setAcademiesLoading(false))
  }, [currentPage, searchTerm, statusFilter])

  useEffect(() => {
    fetchAcademies()
  }, [fetchAcademies])

  // Reset to page 1 when filters change
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }
  const handleStatusFilter = (value: AcademyStatusFilter) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  if (!user) return null

  return (
    <DashboardLayout
      user={user}
      academy={academy}
      variant='full'
      dashboardType='super-admin'
      title={t('super_admin.dashboard.title')}
      subtitle={t('super_admin.dashboard.subtitle')}
    >
      <div className='space-y-6'>
        <GlobalStatsOverview
          stats={globalStats}
          loading={statsLoading}
          error={statsError}
        />

        <AcademyManagementPanel
          academies={academies}
          meta={academiesMeta}
          loading={academiesLoading}
          error={academiesError}
          currentPage={currentPage}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onPageChange={setCurrentPage}
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
        />
      </div>
    </DashboardLayout>
  )
}
