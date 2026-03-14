import { useQuery } from '@tanstack/react-query'
import { courseService } from '@/services/course-service'
import type { CourseFilters } from '@/types'

/**
 * Hook to fetch public courses from a specific academy
 * @param academySlug - The academy slug
 * @param filters - Optional filters for courses
 */
export function useAcademyCourses(
  academySlug: string | undefined,
  filters?: CourseFilters
) {
  return useQuery({
    queryKey: ['academy-courses', academySlug, filters],
    queryFn: async () => {
      if (!academySlug) {
        throw new Error('Academy slug is required')
      }
      return await courseService.getCoursesByAcademy(academySlug, filters)
    },
    enabled: !!academySlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
