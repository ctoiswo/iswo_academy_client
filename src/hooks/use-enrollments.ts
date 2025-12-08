import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  enrollmentService,
  type EnrollmentFilters,
} from '@/services/enrollment-service'
import { toast } from 'sonner'

export function useUserEnrollments(filters?: EnrollmentFilters) {
  return useQuery({
    queryKey: ['user_enrollments', filters],
    queryFn: () => enrollmentService.getUserEnrollments(filters),
  })
}

export function useEnrollment(enrollmentId: number) {
  return useQuery({
    queryKey: ['enrollment', enrollmentId],
    queryFn: () => enrollmentService.getEnrollment(enrollmentId),
    enabled: !!enrollmentId,
  })
}

export function useUpdateEnrollmentProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      enrollmentId,
      progressData,
    }: {
      enrollmentId: number
      progressData: {
        progress_percentage?: number
        completed_lesson_ids?: number[]
      }
    }) =>
      enrollmentService.updateEnrollmentProgress(enrollmentId, progressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment'] })
      toast.success('Progress updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update progress: ${error.message}`)
    },
  })
}
