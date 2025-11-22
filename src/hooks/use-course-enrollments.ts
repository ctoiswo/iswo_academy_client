import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { enrollmentService } from '@/services/enrollment-service'
import { toast } from 'sonner'

export const enrollmentKeys = {
  all: ['enrollments'] as const,
  course: (academySlug: string, courseSlug: string) =>
    [...enrollmentKeys.all, 'course', academySlug, courseSlug] as const,
}

export function useCourseEnrollments(academySlug: string, courseSlug: string) {
  return useQuery({
    queryKey: enrollmentKeys.course(academySlug, courseSlug),
    queryFn: () => enrollmentService.getCourseEnrollments(academySlug, courseSlug),
  })
}

export function useDeleteEnrollment(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (enrollmentId: number) =>
      enrollmentService.deleteEnrollment(academySlug, courseSlug, enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.course(academySlug, courseSlug) })
      toast.success('Estudiante eliminado exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar el estudiante')
    },
  })
}
