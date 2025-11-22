import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { certificateService } from '@/services'

export function useLearningPathCertificateConfiguration(
  academySlug: string,
  learningPathSlug: string
) {
  return useQuery({
    queryKey: ['learning-path-certificate-config', academySlug, learningPathSlug],
    queryFn: () =>
      certificateService.getLearningPathCertificateConfiguration(academySlug, learningPathSlug),
    enabled: !!academySlug && !!learningPathSlug,
  })
}

export function useUpdateLearningPathCertificateConfiguration(
  academySlug: string,
  learningPathSlug: string
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (certificateEnabled: boolean) =>
      certificateService.updateLearningPathCertificateConfiguration(
        academySlug,
        learningPathSlug,
        certificateEnabled
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['learning-path-certificate-config', academySlug, learningPathSlug],
      })
      queryClient.invalidateQueries({
        queryKey: ['learning-path', academySlug, learningPathSlug],
      })
      toast.success('Certificate configuration updated successfully')
    },
    onError: (error: any) => {
      toast.error(`Failed to update configuration: ${error.message}`)
    },
  })
}

export function useLearningPathCertificates(
  academySlug: string,
  learningPathSlug: string,
  page: number = 1,
  perPage: number = 25
) {
  return useQuery({
    queryKey: ['learning-path-certificates', academySlug, learningPathSlug, page, perPage],
    queryFn: () =>
      certificateService.getLearningPathCertificates(academySlug, learningPathSlug, page, perPage),
    enabled: !!academySlug && !!learningPathSlug,
  })
}
