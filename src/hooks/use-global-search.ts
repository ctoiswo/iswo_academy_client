import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export interface SearchResult {
  id: number
  type: 'academy' | 'course'
  // Academy fields
  name?: string
  slug: string
  description?: string
  logo_url?: string
  course_count?: number
  student_count?: number
  is_public?: boolean
  // Course fields
  title?: string
  thumbnail_url?: string
  price?: string
  is_free?: boolean
  difficulty_level?: string
  duration_minutes?: number
  academy?: {
    id: number
    name: string
    slug: string
  }
  creator?: {
    id: number
    name: string
  }
}

export interface SearchResponse {
  query: string
  academies: SearchResult[]
  courses: SearchResult[]
  total_count: number
}

export function useGlobalSearch(
  query: string,
  options?: {
    type?: 'all' | 'academies' | 'courses'
    limit?: number
    enabled?: boolean
  }
) {
  const { type = 'all', limit = 5, enabled = true } = options || {}

  return useQuery<SearchResponse>({
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

      const { data } = await apiClient.get<SearchResponse>('/search', {
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
