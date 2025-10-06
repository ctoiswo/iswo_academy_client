import { useQuery } from '@tanstack/react-query'
import { academyApi, courseApi } from '@/lib/api-client'

export function useFeaturedAcademies(categoryId?: number) {
  return useQuery({
    queryKey: ['featured', 'academies', categoryId],
    queryFn: () => academyApi.getFeaturedAcademies(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAcademyCategories() {
  return useQuery({
    queryKey: ['academy', 'categories'],
    queryFn: academyApi.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useFeaturedCourses(categoryId?: number) {
  return useQuery({
    queryKey: ['featured', 'courses', categoryId],
    queryFn: () => courseApi.getFeaturedCourses(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useFeaturedContent(categoryId?: number) {
  const academiesQuery = useFeaturedAcademies(categoryId)
  const coursesQuery = useFeaturedCourses(categoryId)

  return {
    academies: academiesQuery.data || [],
    courses: coursesQuery.data || [],
    isLoading: academiesQuery.isLoading || coursesQuery.isLoading,
    isError: academiesQuery.isError || coursesQuery.isError,
    error: academiesQuery.error || coursesQuery.error,
    refetch: () => {
      academiesQuery.refetch()
      coursesQuery.refetch()
    }
  }
}