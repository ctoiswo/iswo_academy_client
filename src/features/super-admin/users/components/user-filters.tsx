import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FilterType } from '../types'
import type { GetUsersParams } from '@/lib/super-admin-api'
import { useTranslation } from '@/hooks/use-translation'

interface UserFiltersProps {
  searchInput: string
  filter: FilterType
  sort: GetUsersParams['sort']
  onSearchChange: (value: string) => void
  onFilterChange: (value: FilterType) => void
  onSortChange: (value: GetUsersParams['sort']) => void
}

export function UserFilters({
  searchInput,
  filter,
  sort,
  onSearchChange,
  onFilterChange,
  onSortChange,
}: UserFiltersProps) {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder={t('superAdmin.users.filters.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-10'
        />
      </div>

      <Select
        value={filter}
        onValueChange={(v) => onFilterChange(v as FilterType)}
      >
        <SelectTrigger className='w-full sm:w-48'>
          <SelectValue placeholder={t('superAdmin.users.filters.filterPlaceholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('superAdmin.users.filters.all')}</SelectItem>
          <SelectItem value='confirmed'>{t('superAdmin.users.filters.confirmed')}</SelectItem>
          <SelectItem value='unconfirmed'>{t('superAdmin.users.filters.unconfirmed')}</SelectItem>
          <SelectItem value='super_admin'>{t('superAdmin.users.filters.superAdmin')}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(v) => onSortChange(v as GetUsersParams['sort'])}
      >
        <SelectTrigger className='w-full sm:w-48'>
          <SelectValue placeholder={t('superAdmin.users.filters.sortPlaceholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='created_at'>{t('superAdmin.users.filters.sortDate')}</SelectItem>
          <SelectItem value='last_login_at'>{t('superAdmin.users.filters.sortLastLogin')}</SelectItem>
          <SelectItem value='first_name'>{t('superAdmin.users.filters.sortName')}</SelectItem>
          <SelectItem value='email'>{t('superAdmin.users.filters.sortEmail')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
