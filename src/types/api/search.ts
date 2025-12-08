/**
 * Search related types
 * Matches backend SearchController :search view responses
 */
import type { DifficultyLevel } from '../common'

// Academy search result (from AcademySerializer :search view)
export interface AcademySearchResult {
  id: number
  name: string
  description: string
  slug: string
  logo_url: string | null
  course_count: number
  student_count: number
  is_public: boolean
}

// Course search result (from CourseSerializer :search view)
export interface CourseSearchResult {
  id: number
  title: string
  slug: string
  description: string
  thumbnail_url: string | null
  price: string
  is_free: boolean
  difficulty_level: DifficultyLevel | null
  duration_minutes: number | null
  academy: {
    id: number
    name: string
    slug: string
  } | null
  creator: {
    id: number
    name: string
  } | null
}

// Global search response from /api/v1/search
export interface GlobalSearchResponse {
  query: string
  academies: AcademySearchResult[]
  courses: CourseSearchResult[]
  total_count: number
}

// Search filters for query params
export interface SearchFilters {
  q: string
  type?: 'all' | 'academies' | 'courses'
  limit?: number
}
