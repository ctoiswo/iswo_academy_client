import type { SuperAdminPayment } from '@/lib/super-admin-api'

export type PaymentFilterType =
  | 'all'
  | 'completed'
  | 'pending'
  | 'failed'
  | 'refunded'

export interface RefundTarget {
  payment: SuperAdminPayment
}
