/**
 * Academy Categories Hooks
 * React Query hooks para categorías de academias
 */

import { useQuery } from '@tanstack/react-query'
import academyCategoryService from '@/services/academy-category-service'
import type { ViewMode } from '@/lib/api-view-modes'

/**
 * Hook for fetching academy categories with view mode support
 * 
 * @param view - View mode (default: 'minimal')
 * @returns Query object with academy categories data, loading and error states
 */
export function useAcademyCategories<T extends ViewMode = 'minimal'>(
  view?: T
) {
  // Default to 'minimal' view for list displays
  const viewMode = view || ('minimal' as T)
  
  return useQuery({
    queryKey: ['academy', 'categories', viewMode],
    queryFn: () => academyCategoryService.getCategories(viewMode),
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
    queryFn: () => academyCategoryService.getCategoryBySlug(slug, view),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!slug, // Only run the query if a slug is provided
  })
}
