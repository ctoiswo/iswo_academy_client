import { type AcademySummaryLight } from '@/types'
import { type RefObject } from 'react'
import { type AcademyCategoryMinimal } from '@/types'

/**
 * Types for academies landing page components
 */
export interface AcademiesHeroProps {
  search: string
  onSearchChange: (value: string) => void
  totalAcademies: number
}

export interface AcademiesGridProps {
  academies: AcademySummaryLight[]
  isLoading: boolean
  isFetchingNextPage: boolean
  sentinelRef: RefObject<HTMLDivElement | null>
  onClearFilters: () => void
}

export interface AcademiesFilterProps {
  categories: AcademyCategoryMinimal[]
  activeCategory: string | null
  onCategoryChange: (slug: string | null) => void
  totalCount: number
  loadedCount: number
}