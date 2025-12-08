import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonService } from '@/services/lesson-service'
import type { CreateLessonRequest, UpdateLessonRequest } from '@/types'
import { toast } from 'sonner'

export function useLessons(
  academySlug: string,
  courseSlug: string,
  sectionId: number
) {
  return useQuery({
    queryKey: ['lessons', academySlug, courseSlug, sectionId],
    queryFn: () => lessonService.getLessons(academySlug, courseSlug, sectionId),
    enabled: !!academySlug && !!courseSlug && !!sectionId,
  })
}

export function useLesson(
  academySlug: string,
  courseSlug: string,
  sectionId: number,
  lessonId: number
) {
  return useQuery({
    queryKey: ['lesson', academySlug, courseSlug, sectionId, lessonId],
    queryFn: () =>
      lessonService.getLesson(academySlug, courseSlug, sectionId, lessonId),
    enabled: !!academySlug && !!courseSlug && !!sectionId && !!lessonId,
  })
}

export function useCreateLesson(
  academySlug: string,
  courseSlug: string,
  sectionId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateLessonRequest) =>
      lessonService.createLesson(academySlug, courseSlug, sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lessons', academySlug, courseSlug, sectionId],
      })
      queryClient.invalidateQueries({
        queryKey: ['sections', academySlug, courseSlug],
      })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Lección creada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al crear la lección: ${error.message}`)
    },
  })
}

export function useUpdateLesson(
  academySlug: string,
  courseSlug: string,
  sectionId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: number
      data: UpdateLessonRequest
    }) =>
      lessonService.updateLesson(
        academySlug,
        courseSlug,
        sectionId,
        lessonId,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lessons', academySlug, courseSlug, sectionId],
      })
      queryClient.invalidateQueries({
        queryKey: ['sections', academySlug, courseSlug],
      })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Lección actualizada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar la lección: ${error.message}`)
    },
  })
}

export function useDeleteLesson(
  academySlug: string,
  courseSlug: string,
  sectionId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: number) =>
      lessonService.deleteLesson(academySlug, courseSlug, sectionId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lessons', academySlug, courseSlug, sectionId],
      })
      queryClient.invalidateQueries({
        queryKey: ['sections', academySlug, courseSlug],
      })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast.success('Lección eliminada exitosamente')
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar la lección: ${error.message}`)
    },
  })
}

export function useReorderLesson(
  academySlug: string,
  courseSlug: string,
  sectionId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      lessonId,
      position,
    }: {
      lessonId: number
      position: number
    }) =>
      lessonService.reorderLesson(
        academySlug,
        courseSlug,
        sectionId,
        lessonId,
        position
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lessons', academySlug, courseSlug, sectionId],
      })
    },
    onError: (error: any) => {
      toast.error(`Error al reordenar la lección: ${error.message}`)
    },
  })
}
