import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { Academy, AcademyFilters, PaginatedResponse } from '@/types'

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
