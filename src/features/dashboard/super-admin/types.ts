import type { GlobalStats, AcademyOverview } from '@/lib/api-client'

export type { GlobalStats, AcademyOverview }

export type AcademyStatusFilter = 'all' | 'active' | 'inactive' | 'suspended'

export interface AcademiesMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}
