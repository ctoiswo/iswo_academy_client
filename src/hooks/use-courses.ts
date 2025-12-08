import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseService } from '@/services/course-service'
import type {
  CourseFilters,
  CreateCourseRequest,
  UpdateCourseRequest,
} from '@/types'
import { toast } from 'sonner'

export function useCourses(
  academySlug: string | number,
  filters?: CourseFilters
) {
  return useQuery({
    queryKey: ['courses', academySlug, filters],
    queryFn: () => courseService.getCourses(academySlug, filters),
    enabled: !!academySlug,
  })
}

export function useCourse(slugOrId: string | number) {
  return useQuery({
    queryKey: ['course', slugOrId],
    queryFn: () => courseService.getCourseBySlug(slugOrId),
    enabled: !!slugOrId,
  })
}

export function useCourseBySlug(academyId: number, slug: string) {
  return useQuery({
    queryKey: ['course', academyId, slug],
    queryFn: async () => {
      // Get all courses for the academy and find the one with matching slug
      const courses = await courseService.getCourses(academyId)
      const course = courses.find((c) => c.slug === slug)

      if (!course) {
        throw new Error(`Course with slug "${slug}" not found`)
      }

      return course
    },
    enabled: !!academyId && !!slug,
  })
}

export function useCreateCourse(academySlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCourseRequest) =>
      courseService.createCourse(academySlug, data),
    onSuccess: () => {
      // Invalidate all course queries for this academy (with any filters)
      queryClient.invalidateQueries({
        queryKey: ['courses', academySlug],
        exact: false,
      })
      toast.success('Course created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create course: ${error.message}`)
    },
  })
}

export function useUpdateCourse(academySlug: string | number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      courseSlug,
      data,
    }: {
      courseSlug: string | number
      data: UpdateCourseRequest
    }) => courseService.updateCourse(academySlug, courseSlug, data),
    onSuccess: () => {
      // Invalidate all course queries for this academy (with any filters)
      queryClient.invalidateQueries({
        queryKey: ['courses', academySlug],
        exact: false,
      })
      toast.success('Curso actualizado exitosamente')
    },
    onError: (error) => {
      toast.error(`Error al actualizar el curso: ${error.message}`)
    },
  })
}

export function useDeleteCourse(academySlug: string | number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseSlug: string | number) =>
      courseService.deleteCourse(academySlug, courseSlug),
    onSuccess: () => {
      // Invalidate all course queries for this academy (with any filters)
      queryClient.invalidateQueries({
        queryKey: ['courses', academySlug],
        exact: false,
      })
      toast.success('Course deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete course: ${error.message}`)
    },
  })
}

// Hooks for public course access
export function useAllCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: ['all-courses', filters],
    queryFn: () => courseService.getAllCourses(filters),
  })
}

export function useCoursesByAcademy(
  academySlug: string,
  filters?: CourseFilters
) {
  return useQuery({
    queryKey: ['courses-by-academy', academySlug, filters],
    queryFn: () => courseService.getCoursesByAcademy(academySlug, filters),
    enabled: !!academySlug,
  })
}
