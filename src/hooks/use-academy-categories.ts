/**
 * Academy Categories Hooks
 * React Query hooks para categorías de academias con soporte de vistas
 */
import { useQuery } from '@tanstack/react-query'
import academyCategoryService from '@/services/academy-category-service'
import type { ApiViewMode } from '@/types'

/**
 * Hook for fetching academy categories with view mode support
 * @param view - View mode: 'minimal' | 'summary' | 'full' (default: 'summary')
 * @returns Query object with academy categories data, loading and error states
 *
 * @example
 * // Minimal view - for dropdowns
 * const { data } = useAcademyCategories('minimal')
 *
 * // Summary view - for lists with counts
 * const { data } = useAcademyCategories('summary')
 *
 * // Full view - with academies array
 * const { data } = useAcademyCategories('full')
 */
export function useAcademyCategories<TView extends ApiViewMode = 'summary'>(
  view?: TView
) {
  const viewMode = view || ('summary' as TView)

  return useQuery({
    queryKey: ['academy', 'categories', viewMode],
    queryFn: () => academyCategoryService.getCategories(viewMode),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

/**
 * Hook for fetching a specific academy category by slug
 * @param slug - The category slug to fetch
 * @param view - View mode: 'minimal' | 'summary' | 'full' (default: 'full')
 * @returns Query object with academy category data, loading and error states
 */
export function useAcademyCategoryBySlug<TView extends ApiViewMode = 'full'>(
  slug: string,
  view?: TView
) {
  const viewMode = view || ('full' as TView)

  return useQuery({
    queryKey: ['academy', 'category', 'slug', slug, viewMode],
    queryFn: () => academyCategoryService.getCategoryBySlug(slug, viewMode),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!slug, // Only run the query if a slug is provided
  })
}
