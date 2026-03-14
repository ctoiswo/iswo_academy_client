import type {
  SuperAdminUser,
  UsersMeta,
  GetUsersParams,
} from '@/lib/super-admin-api'
import { ToggleSuperAdminDialog } from '../components/toggle-super-admin-dialog'
import { UserFilters } from '../components/user-filters'
import { UserPagination } from '../components/user-pagination'
import { UserStatsCards } from '../components/user-stats-cards'
import { UserTable } from '../components/user-table'
import type { FilterType, ConfirmTarget } from '../types'

interface UserManagementPanelProps {
  users: SuperAdminUser[]
  meta: UsersMeta
  loading: boolean
  searchInput: string
  searchQuery: string
  filter: FilterType
  sort: GetUsersParams['sort']
  currentPage: number
  currentUserId: number | undefined
  confirmTarget: ConfirmTarget | null
  actionLoading: boolean
  onSearchChange: (value: string) => void
  onFilterChange: (value: FilterType) => void
  onSortChange: (value: GetUsersParams['sort']) => void
  onPageChange: (page: number) => void
  onConfirmTarget: (target: ConfirmTarget) => void
  onConfirmAction: () => void
  onCloseDialog: () => void
}

export function UserManagementPanel({
  users,
  meta,
  loading,
  searchInput,
  searchQuery,
  filter,
  sort,
  currentPage,
  currentUserId,
  confirmTarget,
  actionLoading,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onPageChange,
  onConfirmTarget,
  onConfirmAction,
  onCloseDialog,
}: UserManagementPanelProps) {
  return (
    <>
      <div className='space-y-6'>
        <UserStatsCards meta={meta} />

        <UserFilters
          searchInput={searchInput}
          filter={filter}
          sort={sort}
          onSearchChange={onSearchChange}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
        />

        <UserTable
          users={users}
          loading={loading}
          searchQuery={searchQuery}
          currentUserId={currentUserId}
          onConfirm={onConfirmTarget}
        />

        <UserPagination
          meta={meta}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      </div>

      <ToggleSuperAdminDialog
        target={confirmTarget}
        loading={actionLoading}
        onConfirm={onConfirmAction}
        onClose={onCloseDialog}
      />
    </>
  )
}
