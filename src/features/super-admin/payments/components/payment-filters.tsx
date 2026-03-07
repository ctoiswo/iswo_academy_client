import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTranslation } from '@/hooks/use-translation'
import type { PaymentFilterType } from '../types'
import type { GetPaymentsParams } from '@/lib/super-admin-api'

interface PaymentFiltersProps {
  searchInput: string
  filter: PaymentFilterType
  sort: GetPaymentsParams['sort']
  onSearchChange: (value: string) => void
  onFilterChange: (value: PaymentFilterType) => void
  onSortChange: (value: GetPaymentsParams['sort']) => void
}

export function PaymentFilters({
  searchInput,
  filter,
  sort,
  onSearchChange,
  onFilterChange,
  onSortChange,
}: PaymentFiltersProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder={t('superAdmin.payments.filters.searchPlaceholder')}
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className='pl-10'
        />
      </div>

      <Select
        value={filter}
        onValueChange={(v) => onFilterChange(v as PaymentFilterType)}
      >
        <SelectTrigger className='w-full sm:w-48'>
          <SelectValue placeholder={t('superAdmin.payments.filters.filterPlaceholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>{t('superAdmin.payments.filters.filterAll')}</SelectItem>
          <SelectItem value='completed'>{t('superAdmin.payments.filters.filterCompleted')}</SelectItem>
          <SelectItem value='pending'>{t('superAdmin.payments.filters.filterPending')}</SelectItem>
          <SelectItem value='failed'>{t('superAdmin.payments.filters.filterFailed')}</SelectItem>
          <SelectItem value='refunded'>{t('superAdmin.payments.filters.filterRefunded')}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(v) => onSortChange(v as GetPaymentsParams['sort'])}
      >
        <SelectTrigger className='w-full sm:w-48'>
          <SelectValue placeholder={t('superAdmin.payments.filters.sortPlaceholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='created_at'>{t('superAdmin.payments.filters.sortDate')}</SelectItem>
          <SelectItem value='amount'>{t('superAdmin.payments.filters.sortAmount')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
