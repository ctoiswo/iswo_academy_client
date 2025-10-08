import { useQuery } from '@tanstack/react-query'
import { academyService, courseService, academyCategoryService } from '@/services/'

export function useFeaturedAcademies(categoryId?: number) {
  return useQuery({
    queryKey: ['featured', 'academies', categoryId],
    queryFn: () => academyService.getFeaturedAcademies(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAcademyCategories() {
  return useQuery({
    queryKey: ['academy', 'categories', { view: 'minimal' }],
    queryFn: () => academyCategoryService.getCategories('minimal'),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function useFeaturedCourses(categoryId?: number) {
  return useQuery({
    queryKey: ['featured', 'courses', categoryId],
    queryFn: () => courseService.getFeaturedCourses(categoryId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCourseBySlug(slug: string) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => courseService.getCourseBySlug(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug, // Solo ejecutar si hay slug
  })
}