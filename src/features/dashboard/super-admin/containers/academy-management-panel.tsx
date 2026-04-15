import { useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DashboardCard } from '@/components/dashboard'
import { AcademyFilters } from '../components/academy-filters'
import { AcademyPagination } from '../components/academy-pagination'
import { AcademyTable } from '../components/academy-table'
import type {
  AcademyOverview,
  AcademiesMeta,
  AcademyStatusFilter,
} from '../types'

interface AcademyManagementPanelProps {
  academies: AcademyOverview[]
  meta: AcademiesMeta | null
  loading?: boolean
  error?: string | null
  currentPage: number
  searchTerm: string
  statusFilter: AcademyStatusFilter
  onPageChange: (page: number) => void
  onSearch: (value: string) => void
  onStatusFilter: (value: AcademyStatusFilter) => void
  onRefresh: () => void
}

export function AcademyManagementPanel({
  academies,
  meta,
  loading = false,
  error,
  currentPage,
  searchTerm,
  statusFilter,
  onPageChange,
  onSearch,
  onStatusFilter,
  onRefresh,
}: AcademyManagementPanelProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (error) {
    return (
      <DashboardCard title={t('super_admin.academies.title')}>
        <div className='py-8 text-center'>
          <p className='text-destructive'>
            {t('super_admin.academies.errorLoading', { message: error })}
          </p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard
      title={t('super_admin.academies.title')}
      description={t('super_admin.academies.description')}
      action={
        <Button size='sm' onClick={() => navigate({ to: '/create-academy' })}>
          <Plus className='mr-2 h-4 w-4' />
          {t('super_admin.academies.addAcademy')}
        </Button>
      }
    >
      <AcademyFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        totalCount={meta?.total_count ?? academies.length}
        onSearch={onSearch}
        onStatusFilter={onStatusFilter}
      />

      <AcademyTable
        academies={academies}
        loading={loading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onRefresh={onRefresh}
      />

      <AcademyPagination
        currentPage={currentPage}
        totalPages={meta?.total_pages ?? 1}
        totalCount={meta?.total_count ?? academies.length}
        onPageChange={onPageChange}
      />
    </DashboardCard>
  )
}
