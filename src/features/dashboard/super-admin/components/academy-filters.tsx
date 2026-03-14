import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import type { AcademyStatusFilter } from '../types'

interface AcademyFiltersProps {
  searchTerm: string
  statusFilter: AcademyStatusFilter
  totalCount: number
  onSearch: (value: string) => void
  onStatusFilter: (value: AcademyStatusFilter) => void
}

export function AcademyFilters({
  searchTerm,
  statusFilter,
  totalCount,
  onSearch,
  onStatusFilter,
}: AcademyFiltersProps) {
  const { t } = useTranslation()
  return (
    <div className='mb-6 flex items-center justify-between'>
      <div className='flex items-center space-x-4'>
        <div className='relative'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder={t('super_admin.academies.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className='w-64 pl-10'
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              {t('super_admin.academies.statusLabel')}:{' '}
              {statusFilter === 'all'
                ? t('super_admin.academies.statusAll')
                : t(
                    `super_admin.academies.status${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`
                  )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onStatusFilter('all')}>
              {t('super_admin.academies.statusAll')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilter('active')}>
              {t('super_admin.academies.statusActive')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilter('inactive')}>
              {t('super_admin.academies.statusInactive')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilter('suspended')}>
              {t('super_admin.academies.statusSuspended')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className='text-muted-foreground text-sm'>
        {t('super_admin.academies.totalCount', { count: totalCount })}
      </p>
    </div>
  )
}
