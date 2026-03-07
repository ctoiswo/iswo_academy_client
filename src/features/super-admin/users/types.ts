import type { SuperAdminUser } from '@/lib/super-admin-api'

export type FilterType = 'all' | 'confirmed' | 'unconfirmed' | 'super_admin'

export interface ConfirmTarget {
  user: SuperAdminUser
  action: 'promote' | 'demote'
}
