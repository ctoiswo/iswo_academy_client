import { useMutation, useQueryClient } from '@tanstack/react-query'
import learningPathCoursesService from '@/services/learning-path-courses-service'
import { toast } from 'sonner'

export function useAddCourseToLearningPath(
  academySlug: string,
  learningPathSlug: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: number) =>
      learningPathCoursesService.addCourse(
        academySlug,
        learningPathSlug,
        courseId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['learning-path', academySlug, learningPathSlug],
      })
      queryClient.invalidateQueries({
        queryKey: ['learning-paths', academySlug],
      })
      toast.success('Course added to learning path')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add course')
    },
  })
}

export function useRemoveCourseFromLearningPath(
  academySlug: string,
  learningPathSlug: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: number) =>
      learningPathCoursesService.removeCourse(
        academySlug,
        learningPathSlug,
        courseId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['learning-path', academySlug, learningPathSlug],
      })
      queryClient.invalidateQueries({
        queryKey: ['learning-paths', academySlug],
      })
      toast.success('Course removed from learning path')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove course')
    },
  })
}

export function useReorderCourses(
  academySlug: string,
  learningPathSlug: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderedIds: number[]) =>
      learningPathCoursesService.reorderCourses(
        academySlug,
        learningPathSlug,
        orderedIds
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['learning-path', academySlug, learningPathSlug],
      })
      toast.success('Courses reordered successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reorder courses')
    },
  })
}
