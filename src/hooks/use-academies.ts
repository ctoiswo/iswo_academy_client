import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import type {
  Academy,
  AcademyFilters,
  AcademySummaryLight,
  PaginatedResponse,
} from '@/types'
import { apiClient } from '@/lib/api-client'

// Re-export types for backward compatibility
export type { Academy, AcademyFilters }
export type AcademiesResponse = PaginatedResponse<Academy>

/**
 * Hook para obtener academias con filtros
 * Usa el endpoint GET /api/v1/academies con query params
 * El filtrado se hace en el backend usando AcademyFilter
 */
export function useAcademies(filters?: AcademyFilters) {
  return useQuery<Academy[]>({
    queryKey: ['academies', filters],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (filters?.search) {
        params.append('search', filters.search)
      }

      if (filters?.category && filters.category !== 'all') {
        params.append('category', filters.category)
      }

      if (filters?.sort_by) {
        params.append('sort_by', filters.sort_by)
      }

      const queryString = params.toString()
      const url = queryString ? `/academies?${queryString}` : '/academies'

      const response = await apiClient.get<AcademiesResponse>(url)

      // El backend puede devolver { data: [...] } o directamente [...]
      // Manejamos ambos casos
      return Array.isArray(response.data) ? response.data : response.data.data
    },
    staleTime: 30 * 1000, // 30 segundos - los resultados de búsqueda pueden cambiar
    gcTime: 5 * 60 * 1000, // 5 minutos en caché
  })
}

/**
 * Hook for the public academies landing page.
 * Works for both guests and authenticated users — the backend returns
 * :summary_light for guests and :summary for authenticated users automatically.
 */
export function usePublicAcademies(filters?: AcademyFilters) {
  return useQuery<PaginatedResponse<AcademySummaryLight>>({
    queryKey: ['public-academies', filters],
    queryFn: async () => {
      const response = await apiClient.get('/academies', { params: filters })
      if (response.data?.data && response.data?.meta) {
        return response.data as PaginatedResponse<AcademySummaryLight>
      }
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || []
      return {
        data,
        meta: {
          current_page: 1,
          total_pages: 1,
          total_count: data.length,
          per_page: filters?.per_page || 15,
        },
      }
    },
    staleTime: 60_000, // 1 minute
    placeholderData: (prev) => prev,
  })
}

/**
 * Infinite-scroll hook for the public academies landing page.
 * Fetches academies page by page as the user scrolls.
 */
export function usePublicAcademiesInfinite(
  filters?: Omit<AcademyFilters, 'page'>
) {
  return useInfiniteQuery({
    queryKey: ['public-academies-infinite', filters],
    queryFn: ({ pageParam }) =>
      apiClient
        .get('/academies', { params: { ...filters, page: pageParam } })
        .then((res) => {
          if (res.data?.data && res.data?.meta)
            return res.data as PaginatedResponse<AcademySummaryLight>
          const data = Array.isArray(res.data) ? res.data : res.data?.data || []
          return {
            data,
            meta: {
              current_page: 1,
              total_pages: 1,
              total_count: data.length,
              per_page: filters?.per_page || 12,
            },
          }
        }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { current_page, total_pages } = lastPage.meta
      return current_page < total_pages ? current_page + 1 : undefined
    },
    staleTime: 60_000,
  })
}

/**
 * Hook para obtener academias destacadas (featured)
 */
export function useFeaturedAcademies(categoryId?: number, limit = 10) {
  return useQuery<Academy[]>({
    queryKey: ['academies', 'featured', categoryId, limit],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (categoryId) {
        params.append('academy_category_id', categoryId.toString())
      }

      if (limit) {
        params.append('limit', limit.toString())
      }

      const queryString = params.toString()
      const url = queryString
        ? `/academies/featured?${queryString}`
        : '/academies/featured'

      const response = await apiClient.get<AcademiesResponse>(url)
      return Array.isArray(response.data) ? response.data : response.data.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}

/**
 * Hook para obtener una academia por slug
 */
export function useAcademyBySlug(slug: string) {
  return useQuery<Academy>({
    queryKey: ['academy', slug],
    queryFn: async () => {
      const response = await apiClient.get<Academy>(`/academies/${slug}`)
      return response.data
    },
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })
}
