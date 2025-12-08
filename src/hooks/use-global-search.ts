import { useQuery } from '@tanstack/react-query'
import type { GlobalSearchResponse } from '@/types'
import { apiClient } from '@/lib/api-client'

/**
 * Hook for global search across academies and courses
 * Uses the /api/v1/search endpoint
 */
export function useGlobalSearch(
  query: string,
  options?: {
    type?: 'all' | 'academies' | 'courses'
    limit?: number
    enabled?: boolean
  }
) {
  const { type = 'all', limit = 5, enabled = true } = options || {}

  return useQuery<GlobalSearchResponse>({
    queryKey: ['search', query, type, limit],
    queryFn: async () => {
      if (!query || query.length < 2) {
        return {
          query: query || '',
          academies: [],
          courses: [],
          total_count: 0,
        }
      }

      const { data } = await apiClient.get<GlobalSearchResponse>('/search', {
        params: {
          q: query,
          type,
          limit,
        },
      })

      return data
    },
    enabled: enabled && query.length >= 2,
    staleTime: 1000 * 30, // 30 seconds
  })
}
