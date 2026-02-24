import type { FeaturedAcademy } from '@/types/entities/category'
import { type Course } from '@/types'
import { type RefObject } from 'react'

/**
 * Types for landing/home page components
 */

/** Card props for the reusable AcademyCard powered by the API (snake_case) */
export interface AcademyCardProps {
  academy: FeaturedAcademy
  accentFrom: string
  accentTo: string
  index?: number
}

/**
 * Static data shape used by the academies-landing page (not yet migrated to the API).
 * Kept as camelCase to avoid breaking that page.
 */
export interface LandingAcademy {
  id: string
  name: string
  description: string
  coursesCount: number
  studentsCount: number
  rating: number
  instructor: string
  coverImage?: string
}

export interface LandingCategory {
  id: string
  name: string
  tagline: string
  description: string
  icon: string
  accentFrom: string
  accentTo: string
  academies: LandingAcademy[]
}

export interface LandingCourse {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  duration: string
  totalLessons: number
  rating: number
  students: number
  price: string
  /** Optional image URL (promotional image or thumbnail from the backend) */
  thumbnailUrl?: string
  /** Course slug for deep-linking */
  slug?: string
}

export interface CoursesFilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  resultsCount: number
}

export interface CoursesGridProps {
  courses: Course[]
  isLoading?: boolean
  isFetchingNextPage?: boolean
  sentinelRef?: RefObject<HTMLDivElement | null>
  onClearFilters: () => void
}