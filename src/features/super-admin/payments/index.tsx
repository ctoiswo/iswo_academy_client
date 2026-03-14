import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import {
  superAdminApi,
  type SuperAdminPayment,
  type PaymentsMeta,
  type GetPaymentsParams,
} from '@/lib/super-admin-api'
import { useTranslation } from '@/hooks/use-translation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { PaymentManagementPanel } from './containers/payment-management-panel'
import type { PaymentFilterType, RefundTarget } from './types'

const DEFAULT_META: PaymentsMeta = {
  current_page: 1,
  total_pages: 1,
  total_count: 0,
  per_page: 25,
  completed_count: 0,
  pending_count: 0,
  failed_count: 0,
  refunded_count: 0,
  total_revenue: 0,
  this_month_revenue: 0,
}

export function SuperAdminPaymentsPage() {
  const { user: currentUser } = useAuthStore()
  const { t } = useTranslation()
  const [payments, setPayments] = useState<SuperAdminPayment[]>([])
  const [meta, setMeta] = useState<PaymentsMeta>(DEFAULT_META)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<PaymentFilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<GetPaymentsParams['sort']>('created_at')
  const [refundTarget, setRefundTarget] = useState<RefundTarget | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadPayments = useCallback(
    async (page: number, search: string, activeFilter: PaymentFilterType) => {
      try {
        setLoading(true)
        const params: GetPaymentsParams = {
          page,
          per_page: 25,
          sort,
          dir: 'desc',
        }
        if (search) params.search = search
        if (activeFilter !== 'all') params.status = activeFilter

        const result = await superAdminApi.getPayments(params)
        setPayments(result.data)
        setMeta(result.meta)
        setCurrentPage(page)
      } catch (_err) {
        toast.error(t('superAdmin.payments.toast.loadError'))
      } finally {
        setLoading(false)
      }
    },
    [sort]
  )

  useEffect(() => {
    loadPayments(1, searchQuery, filter)
  }, [searchQuery, filter, sort, loadPayments])

  useEffect(() => {
    const id = setTimeout(() => setSearchQuery(searchInput), 500)
    return () => clearTimeout(id)
  }, [searchInput])

  const handleFilterChange = (value: PaymentFilterType) => {
    setFilter(value)
    setCurrentPage(1)
  }

  const handleRefundConfirm = async () => {
    if (!refundTarget) return
    setActionLoading(true)
    try {
      await superAdminApi.refundPayment(refundTarget.payment.id)
      toast.success(t('superAdmin.payments.toast.refundSuccess'))
      setRefundTarget(null)
      loadPayments(currentPage, searchQuery, filter)
    } catch (_err) {
      toast.error(t('superAdmin.payments.toast.refundError'))
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <DashboardLayout
      user={currentUser}
      academy={null}
      variant='full'
      dashboardType='super-admin'
      title={t('superAdmin.payments.title')}
      subtitle={t('superAdmin.payments.subtitle')}
    >
      <PaymentManagementPanel
        payments={payments}
        meta={meta}
        loading={loading}
        searchInput={searchInput}
        filter={filter}
        sort={sort}
        currentPage={currentPage}
        refundTarget={refundTarget}
        actionLoading={actionLoading}
        onSearchChange={setSearchInput}
        onFilterChange={handleFilterChange}
        onSortChange={setSort}
        onPageChange={(page) => loadPayments(page, searchQuery, filter)}
        onRefundTarget={setRefundTarget}
        onRefundConfirm={handleRefundConfirm}
        onCloseDialog={() => setRefundTarget(null)}
      />
    </DashboardLayout>
  )
}
