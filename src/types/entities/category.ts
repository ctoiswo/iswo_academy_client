/**
 * Category related types
 */

export interface AcademyCategory {
  id: number
  name: string // varchar(100), not null
  slug: string // varchar(100), not null, unique
  description?: string | null // text
  
  // Computed fields (from serializer)
  icon?: string
  color?: string
  academies_count?: number
  courses_count?: number
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface CategoryWithCount extends AcademyCategory {
  count: number
}

export interface CategoryFilters {
  search?: string
  sort_by?: 'name' | 'academies_count' | 'courses_count'
  sort_direction?: 'asc' | 'desc'
}
