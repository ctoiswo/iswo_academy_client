import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { learningPathService, type LearningPathFilters, type CreateLearningPathData, type UpdateLearningPathData } from '@/services'

export function useLearningPaths(academyId: number, filters?: LearningPathFilters) {
  return useQuery({
    queryKey: ['learning-paths', academyId, filters],
    queryFn: () => learningPathService.getLearningPaths(academyId, filters),
    enabled: !!academyId,
  })
}

export function useLearningPath(slugOrId: string | number) {
  return useQuery({
    queryKey: ['learning-path', slugOrId],
    queryFn: () => learningPathService.getLearningPathBySlug(slugOrId),
    enabled: !!slugOrId,
  })
}

export function useCreateLearningPath(academyId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLearningPathData) =>
      learningPathService.createLearningPath(academyId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths', academyId] })
      toast.success('Learning Path created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create learning path: ${error.message}`)
    },
  })
}

export function useUpdateLearningPath(academyId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ learningPathId, data }: { learningPathId: number; data: UpdateLearningPathData }) =>
      learningPathService.updateLearningPath(academyId, learningPathId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths', academyId] })
      toast.success('Learning Path updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update learning path: ${error.message}`)
    },
  })
}

export function useDeleteLearningPath(academyId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (learningPathId: number) =>
      learningPathService.deleteLearningPath(academyId, learningPathId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths', academyId] })
      toast.success('Learning Path deleted successfully')
    },
    onError: (error) => {
      toast.error(`Failed to delete learning path: ${error.message}`)
    },
  })
}