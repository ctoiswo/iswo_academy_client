/**
 * Category related types
 * Matches backend AcademyCategorySerializer views
 */
import type { Academy } from './academy'

// Base fields present in ALL views
export interface AcademyCategoryBase {
  id: number
  name: string
  slug: string
}

// Minimal view - Only essential fields for dropdowns/lists
// Backend: minimal_hash
export interface AcademyCategoryMinimal extends AcademyCategoryBase {
  // No additional fields
}

// Summary view - Key information without relations
// Backend: summary_hash
export interface AcademyCategorySummary extends AcademyCategoryBase {
  description: string | null
  academies_count: number
}

// Full view - Complete data including relations
// Backend: full_hash
export interface AcademyCategoryFull extends AcademyCategorySummary {
  academies: Academy[]
  created_at: string
  updated_at: string
}

// Default export - Full view (backward compatibility)
export type AcademyCategory = AcademyCategoryFull

// Helper type for CategoryWithCount (used in some UI components)
export interface CategoryWithCount extends AcademyCategorySummary {
  count: number // Alias for academies_count
}

// Filter parameters
export interface CategoryFilters {
  search?: string
  sort_by?: 'name' | 'academies_count' | 'courses_count'
  sort_direction?: 'asc' | 'desc'
}
