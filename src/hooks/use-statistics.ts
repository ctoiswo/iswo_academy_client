import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Tipos para las estadísticas generales
export interface GeneralStatistics {
  total_academies: number
  total_students: number
  total_categories: number
  total_courses: number
}

// Tipos para estadísticas detalladas de academias
export interface AcademyStatistics {
  total: number
  by_category: Array<{
    name: string
    count: number
  }>
  most_popular: Array<{
    id: number
    name: string
    slug: string
    students_count: number
  }>
  newest: Array<{
    id: number
    name: string
    slug: string
    created_at: string
  }>
}

// Tipos para contenido trending
export interface TrendingStatistics {
  academies: Array<{
    id: number
    name: string
    slug: string
    recent_enrollments: number
  }>
  courses: Array<{
    id: number
    title: string
    slug: string
    recent_enrollments: number
  }>
  categories: Array<{
    id: number
    name: string
    slug: string
    recent_activity: number
  }>
}

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
