import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { DashboardCard } from '@/components/dashboard'
import type { AcademyOverview, AcademiesMeta } from '../types'
import type { AcademyStatusFilter } from '../types'
import { AcademyFilters } from '../components/academy-filters'
import { AcademyTable } from '../components/academy-table'
import { AcademyPagination } from '../components/academy-pagination'

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
}: AcademyManagementPanelProps) {
  const { t } = useTranslation()
  if (error) {
    return (
      <DashboardCard title={t('super_admin.academies.title')}>
        <div className='py-8 text-center'>
          <p className='text-destructive'>{t('super_admin.academies.errorLoading', { message: error })}</p>
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardCard
      title={t('super_admin.academies.title')}
      description={t('super_admin.academies.description')}
      action={
        <Button size='sm'>
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
