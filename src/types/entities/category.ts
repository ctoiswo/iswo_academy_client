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

// ---
// Featured categories endpoint shapes (GET /api/v1/academy_categories/featured)
// Used by landing page carousels
// ---

/**
 * Academy shape returned inside the featured categories endpoint.
 * Matches AcademySerializer#landing_hash
 */
export interface FeaturedAcademy {
  id: number
  name: string
  description: string | null
  slug: string
  /** banner_url ?? logo_url from the backend */
  cover_image: string | null
  courses_count: number
  students_count: number
  instructor: string | null
}

/**
 * Category shape returned by GET /api/v1/academy_categories/featured.
 * Matches AcademyCategorySerializer#featured_hash
 */
export interface FeaturedCategory {
  id: number
  name: string
  slug: string
  description: string | null
  academies: FeaturedAcademy[]
}
