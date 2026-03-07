import { Building2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AcademyOverview } from '../index'
import type { AcademyStatusFilter } from '../types'
import { AcademyRow } from './academy-row'

interface AcademyTableProps {
  academies: AcademyOverview[]
  loading: boolean
  searchTerm: string
  statusFilter: AcademyStatusFilter
}

export function AcademyTable({
  academies,
  loading,
  searchTerm,
  statusFilter,
}: AcademyTableProps) {
  const { t } = useTranslation()
  if (loading) {
    return (
      <div className='space-y-4'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='animate-pulse'>
            <div className='bg-muted h-16 rounded' />
          </div>
        ))}
      </div>
    )
  }

  if (academies.length === 0) {
    return (
      <div className='py-8 text-center'>
        <Building2 className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
        <p className='text-muted-foreground'>
          {searchTerm || statusFilter !== 'all'
            ? t('super_admin.academies.emptyFiltered')
            : t('super_admin.academies.emptyDefault')}
        </p>
      </div>
    )
  }

  return (
    <div className='rounded-md border overflow-x-auto'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('super_admin.academies.colName')}</TableHead>
            <TableHead>{t('super_admin.academies.colStatus')}</TableHead>
            <TableHead className='hidden sm:table-cell text-right'>{t('super_admin.academies.colUsers')}</TableHead>
            <TableHead className='hidden md:table-cell text-right'>{t('super_admin.academies.colCourses')}</TableHead>
            <TableHead className='text-right'>{t('super_admin.academies.colRevenue')}</TableHead>
            <TableHead className='w-[50px]' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {academies.map((academy) => (
            <AcademyRow key={academy.id} academy={academy} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
