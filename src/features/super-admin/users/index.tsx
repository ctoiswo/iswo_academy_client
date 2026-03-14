import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import {
  superAdminApi,
  type SuperAdminUser,
  type UsersMeta,
  type GetUsersParams,
} from '@/lib/super-admin-api'
import { useTranslation } from '@/hooks/use-translation'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { UserManagementPanel } from './containers/user-management-panel'
import type { FilterType, ConfirmTarget } from './types'

const DEFAULT_META: UsersMeta = {
  current_page: 1,
  total_pages: 1,
  total_count: 0,
  per_page: 20,
  confirmed_count: 0,
  unconfirmed_count: 0,
  super_admin_count: 0,
  new_this_month: 0,
}

export function SuperAdminUsersPage() {
  const { user: currentUser } = useAuthStore()
  const { t } = useTranslation()
  const [users, setUsers] = useState<SuperAdminUser[]>([])
  const [meta, setMeta] = useState<UsersMeta>(DEFAULT_META)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<GetUsersParams['sort']>('created_at')
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadUsers = useCallback(
    async (page: number, search: string, activeFilter: FilterType) => {
      try {
        setLoading(true)
        const params: GetUsersParams = { page, per_page: 20, sort, dir: 'desc' }
        if (search) params.search = search
        if (activeFilter === 'confirmed') params.confirmed = 'true'
        if (activeFilter === 'unconfirmed') params.confirmed = 'false'
        if (activeFilter === 'super_admin') params.super_admin = 'true'

        const result = await superAdminApi.getUsers(params)
        setUsers(result.data)
        setMeta(result.meta)
        setCurrentPage(page)
      } catch (_err) {
        toast.error(t('superAdmin.users.toast.loadError'))
      } finally {
        setLoading(false)
      }
    },
    [sort]
  )

  useEffect(() => {
    loadUsers(1, searchQuery, filter)
  }, [searchQuery, filter, sort, loadUsers])

  useEffect(() => {
    const id = setTimeout(() => setSearchQuery(searchInput), 500)
    return () => clearTimeout(id)
  }, [searchInput])

  const handleFilterChange = (value: FilterType) => {
    setFilter(value)
    setCurrentPage(1)
  }

  const handleToggleSuperAdmin = async () => {
    if (!confirmTarget) return
    setActionLoading(true)
    try {
      const isPromoting = confirmTarget.action === 'promote'
      await superAdminApi.updateUser(confirmTarget.user.id, {
        is_super_admin: isPromoting,
      })
      toast.success(
        isPromoting
          ? t('superAdmin.users.toast.promoted', {
              name: confirmTarget.user.full_name,
            })
          : t('superAdmin.users.toast.demoted', {
              name: confirmTarget.user.full_name,
            })
      )
      setConfirmTarget(null)
      loadUsers(currentPage, searchQuery, filter)
    } catch (_err) {
      toast.error(t('superAdmin.users.toast.updateError'))
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
      title={t('superAdmin.users.title')}
      subtitle={t('superAdmin.users.subtitle')}
    >
      <UserManagementPanel
        users={users}
        meta={meta}
        loading={loading}
        searchInput={searchInput}
        searchQuery={searchQuery}
        filter={filter}
        sort={sort}
        currentPage={currentPage}
        currentUserId={currentUser?.id}
        confirmTarget={confirmTarget}
        actionLoading={actionLoading}
        onSearchChange={setSearchInput}
        onFilterChange={handleFilterChange}
        onSortChange={setSort}
        onPageChange={(page) => loadUsers(page, searchQuery, filter)}
        onConfirmTarget={setConfirmTarget}
        onConfirmAction={handleToggleSuperAdmin}
        onCloseDialog={() => setConfirmTarget(null)}
      />
    </DashboardLayout>
  )
}
