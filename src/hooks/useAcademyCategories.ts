import { useQuery } from '@tanstack/react-query'
import academyCategoriesService, { 
  type AcademyCategory,
  type AcademyCategoryMinimal,
  type AcademyCategorySummary
} from '@/services/academy-categories'
import type { ViewMode } from '@/lib/api-view-modes'

/**
 * Hook for fetching academy categories with view mode support
 * 
 * @param options - Query options including view mode
 * @returns Query object with academy categories data, loading and error states
 */
export function useAcademyCategories<T extends ViewMode = 'minimal'>(
  options?: {
    search?: string
    category?: string
    sortBy?: string
    view?: T
  }
) {
  // Default to 'minimal' view for list displays
  const view = options?.view || ('minimal' as T)
  
  return useQuery({
    queryKey: ['academy', 'categories', options],
    queryFn: () => academyCategoriesService.getCategories({ ...options, view }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Hook for fetching a specific academy category by slug
 * 
 * @param slug - The category slug to fetch
 * @param view - View mode (default: 'full' for detail pages)
 * @returns Query object with academy category data, loading and error states
 */
export function useAcademyCategoryBySlug<T extends ViewMode = 'full'>(
  slug: string,
  view?: T
) {
  return useQuery({
    queryKey: ['academy', 'category', 'slug', slug, view],
    queryFn: () => academyCategoriesService.getCategoryBySlug(slug, view),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!slug, // Only run the query if a slug is provided
  })
}

/**
 * Hook for fetching categories with full academy data
 * Useful for pages that need to display academies within categories
 */
export function useAcademyCategoriesWithAcademies(options?: {
  search?: string
  category?: string
  sortBy?: string
  minAcademies?: number
  onlyWithAcademies?: boolean
}) {
  return useQuery<AcademyCategory[], Error>({
    queryKey: ['academy', 'categories', 'with-academies', options],
    queryFn: () => academyCategoriesService.getCategoriesWithAcademies(options),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}