import { useQuery } from '@tanstack/react-query'
import type {
  GeneralStatistics,
  AcademyStatistics,
  TrendingStatistics,
} from '@/types'
import { apiClient } from '@/lib/api-client'

// Re-export types for backward compatibility
export type { GeneralStatistics, AcademyStatistics, TrendingStatistics }

/**
 * Hook para obtener estadísticas generales de la plataforma
 * Endpoint público, no requiere autenticación
 */
export function useGeneralStatistics() {
  return useQuery<GeneralStatistics>({
    queryKey: ['statistics', 'general'],
    queryFn: async () => {
      const response = await apiClient.get('/statistics/general')
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - las estadísticas no cambian muy rápido
    gcTime: 10 * 60 * 1000, // 10 minutos en caché
  })
}

/**
 * Hook para obtener estadísticas detalladas de academias
 * Endpoint público, no requiere autenticación
 */
export function useAcademyStatistics() {
  return useQuery<AcademyStatistics>({
    queryKey: ['statistics', 'academies'],
    queryFn: async () => {
      const response = await apiClient.get('/statistics/academies')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

/**
 * Hook para obtener contenido trending
 * Endpoint público, no requiere autenticación
 */
export function useTrendingStatistics() {
  return useQuery<TrendingStatistics>({
    queryKey: ['statistics', 'trending'],
    queryFn: async () => {
      const response = await apiClient.get('/statistics/trending')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}
