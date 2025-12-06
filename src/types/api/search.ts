/**
 * Search related types
 */

export type SearchResultType = 'academy' | 'course' | 'lesson' | 'user'

export interface SearchResult {
  id: number
  type: SearchResultType
  title: string
  description?: string
  thumbnail_url?: string
  url: string
  score?: number
  metadata?: Record<string, unknown>
}

export interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
  filters?: {
    type?: SearchResultType[]
    academy_id?: number
  }
}

export interface SearchFilters {
  query: string
  type?: SearchResultType[]
  academy_id?: number
  limit?: number
  offset?: number
}
