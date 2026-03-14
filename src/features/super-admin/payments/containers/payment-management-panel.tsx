import type {
  SuperAdminPayment,
  PaymentsMeta,
  GetPaymentsParams,
} from '@/lib/super-admin-api'
import { PaymentFilters } from '../components/payment-filters'
import { PaymentPagination } from '../components/payment-pagination'
import { PaymentStatsCards } from '../components/payment-stats-cards'
import { PaymentTable } from '../components/payment-table'
import { RefundDialog } from '../components/refund-dialog'
import type { PaymentFilterType, RefundTarget } from '../types'

interface PaymentManagementPanelProps {
  payments: SuperAdminPayment[]
  meta: PaymentsMeta
  loading: boolean
  searchInput: string
  filter: PaymentFilterType
  sort: GetPaymentsParams['sort']
  currentPage: number
  refundTarget: RefundTarget | null
  actionLoading: boolean
  onSearchChange: (value: string) => void
  onFilterChange: (value: PaymentFilterType) => void
  onSortChange: (value: GetPaymentsParams['sort']) => void
  onPageChange: (page: number) => void
  onRefundTarget: (target: RefundTarget) => void
  onRefundConfirm: () => void
  onCloseDialog: () => void
}

export function PaymentManagementPanel({
  payments,
  meta,
  loading,
  searchInput,
  filter,
  sort,
  currentPage,
  refundTarget,
  actionLoading,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onPageChange,
  onRefundTarget,
  onRefundConfirm,
  onCloseDialog,
}: PaymentManagementPanelProps) {
  return (
    <>
      <div className='space-y-6'>
        <PaymentStatsCards meta={meta} />

        <PaymentFilters
          searchInput={searchInput}
          filter={filter}
          sort={sort}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
        />

        <PaymentTable
          payments={payments}
          loading={loading}
          onRefund={onRefundTarget}
        />

        <PaymentPagination
          meta={meta}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>

      <RefundDialog
        target={refundTarget}
        loading={actionLoading}
        onConfirm={onRefundConfirm}
        onClose={onCloseDialog}
      />
    </>
  )
}
