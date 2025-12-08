import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import learningPathEnrollmentsService from '@/services/learning-path-enrollments-service'
import type { EnrollmentFilters } from '@/types'
import { toast } from 'sonner'

export function useLearningPathEnrollments(
  academySlug: string,
  learningPathSlug: string,
  filters?: EnrollmentFilters
) {
  return useQuery({
    queryKey: [
      'learning-path-enrollments',
      academySlug,
      learningPathSlug,
      filters,
    ],
    queryFn: () =>
      learningPathEnrollmentsService.getEnrollments(
        academySlug,
        learningPathSlug,
        filters
      ),
    enabled: !!academySlug && !!learningPathSlug,
  })
}

export function useLearningPathEnrollment(
  academySlug: string,
  learningPathSlug: string,
  enrollmentId: number
) {
  return useQuery({
    queryKey: [
      'learning-path-enrollment',
      academySlug,
      learningPathSlug,
      enrollmentId,
    ],
    queryFn: () =>
      learningPathEnrollmentsService.getEnrollment(
        academySlug,
        learningPathSlug,
        enrollmentId
      ),
    enabled: !!academySlug && !!learningPathSlug && !!enrollmentId,
  })
}

export function useDeleteLearningPathEnrollment(
  academySlug: string,
  learningPathSlug: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (enrollmentId: number) =>
      learningPathEnrollmentsService.deleteEnrollment(
        academySlug,
        learningPathSlug,
        enrollmentId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['learning-path-enrollments', academySlug, learningPathSlug],
      })
      toast.success('Inscripción eliminada exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar la inscripción')
    },
  })
}
