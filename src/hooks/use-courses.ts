import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { courseService, type CourseFilters, type CreateCourseData, type UpdateCourseData } from '@/services/course-service'

export function useCourses(academyId: number, filters?: CourseFilters) {
  return useQuery({
    queryKey: ['courses', academyId, filters],
    queryFn: () => courseService.getCourses(academyId, filters),
    enabled: !!academyId,
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
      const course = courses.find(c => c.slug === slug)

      if (!course) {
        throw new Error(`Course with slug "${slug}" not found`)
      }

      return course
    },
    enabled: !!academyId && !!slug,
  })
}

export function useCreateCourse(academyId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCourseData) =>
      courseService.createCourse(academyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', academyId] })
      toast.success('Course created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create course: ${error.message}`)
    },
  })
}

export function useUpdateCourse(academyId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: UpdateCourseData }) =>
      courseService.updateCourse(academyId, courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', academyId] })
      toast.success('Course updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update course: ${error.message}`)
    },
  })
}

export function useDeleteCourse(academyId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: number) =>
      courseService.deleteCourse(academyId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', academyId] })
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

export function useCoursesByAcademy(academySlug: string, filters?: CourseFilters) {
  return useQuery({
    queryKey: ['courses-by-academy', academySlug, filters],
    queryFn: () => courseService.getCoursesByAcademy(academySlug, filters),
    enabled: !!academySlug,
  })
}