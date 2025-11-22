import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { learningPathService, type LearningPathFilters, type CreateLearningPathData, type UpdateLearningPathData } from '@/services'

export function useLearningPaths(academySlug: string, filters?: LearningPathFilters) {
  return useQuery({
    queryKey: ['learning-paths', academySlug, filters],
    queryFn: () => learningPathService.getLearningPaths(academySlug, filters),
    enabled: !!academySlug,
  })
}

export function useLearningPath(academySlug: string, slugOrId: string | number) {
  return useQuery({
    queryKey: ['learning-path', academySlug, slugOrId],
    queryFn: () => learningPathService.getLearningPathBySlug(academySlug, slugOrId),
    enabled: !!academySlug && !!slugOrId,
  })
}

export function useCreateLearningPath(academySlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLearningPathData) =>
      learningPathService.createLearningPath(academySlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths', academySlug] })
      toast.success('Learning Path created successfully')
    },
    onError: (error) => {
      toast.error(`Failed to create learning path: ${error.message}`)
    },
  })
}

export function useUpdateLearningPath(academySlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ learningPathSlug, data }: { learningPathSlug: string; data: UpdateLearningPathData }) =>
      learningPathService.updateLearningPath(academySlug, learningPathSlug, data),
    onSuccess: (_, variables) => {
      // Invalidate the list of learning paths
      queryClient.invalidateQueries({ queryKey: ['learning-paths', academySlug] })
      // Invalidate the specific learning path being updated
      queryClient.invalidateQueries({ queryKey: ['learning-path', variables.learningPathSlug] })
      toast.success('Learning Path updated successfully')
    },
    onError: (error) => {
      toast.error(`Failed to update learning path: ${error.message}`)
    },
  })
}

export function useDeleteLearningPath(academySlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (learningPathSlug: string) =>
      learningPathService.deleteLearningPath(academySlug, learningPathSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths', academySlug] })
      toast.success('Ruta de aprendizaje eliminada exitosamente')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Error al eliminar'
      toast.error(errorMessage)
    },
  })
}

export function useUpdateLearningPathSettings(academySlug: string, learningPathSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { status?: string; position?: number }) =>
      learningPathService.updateLearningPath(academySlug, learningPathSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-path', academySlug, learningPathSlug] })
      queryClient.invalidateQueries({ queryKey: ['learning-paths', academySlug] })
      toast.success('Configuración actualizada exitosamente')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message || error.message || 'Error al actualizar'
      toast.error(errorMessage)
    },
  })
}

export function useLearningPathAnalytics(academySlug: string, learningPathSlug: string) {
  return useQuery({
    queryKey: ['learning-path-analytics', academySlug, learningPathSlug],
    queryFn: () => learningPathService.getLearningPathAnalytics(academySlug, learningPathSlug),
    enabled: !!academySlug && !!learningPathSlug,
  })
}