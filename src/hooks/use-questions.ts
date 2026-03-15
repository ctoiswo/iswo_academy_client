import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { questionService } from '@/services/question-service'
import type { CreateQuestionRequest, UpdateQuestionRequest } from '@/types'
import { toast } from 'sonner'

// Query keys
export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (academySlug: string, courseSlug: string, assessmentId: number) =>
    [...questionKeys.lists(), academySlug, courseSlug, assessmentId] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    questionId: number
  ) =>
    [
      ...questionKeys.details(),
      academySlug,
      courseSlug,
      assessmentId,
      questionId,
    ] as const,
}

// Get all questions for an assessment
export function useQuestions(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  return useQuery({
    queryKey: questionKeys.list(academySlug, courseSlug, assessmentId),
    queryFn: () =>
      questionService.getQuestions(academySlug, courseSlug, assessmentId),
    enabled: !!academySlug && !!courseSlug && !!assessmentId,
    staleTime: 0,
  })
}

// Get a single question
export function useQuestion(
  academySlug: string,
  courseSlug: string,
  assessmentId: number,
  questionId: number
) {
  return useQuery({
    queryKey: questionKeys.detail(
      academySlug,
      courseSlug,
      assessmentId,
      questionId
    ),
    queryFn: () =>
      questionService.getQuestion(
        academySlug,
        courseSlug,
        assessmentId,
        questionId
      ),
    enabled: !!academySlug && !!courseSlug && !!assessmentId && !!questionId,
  })
}

// Create question
export function useCreateQuestion(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) =>
      questionService.createQuestion(
        academySlug,
        courseSlug,
        assessmentId,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(academySlug, courseSlug, assessmentId),
      })
      toast.success('Pregunta creada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la pregunta: ${error.message}`)
    },
  })
}

// Update question
export function useUpdateQuestion(
  academySlug: string,
  courseSlug: string,
  assessmentId: number,
  questionId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateQuestionRequest) =>
      questionService.updateQuestion(
        academySlug,
        courseSlug,
        assessmentId,
        questionId,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(academySlug, courseSlug, assessmentId),
      })
      queryClient.invalidateQueries({
        queryKey: questionKeys.detail(
          academySlug,
          courseSlug,
          assessmentId,
          questionId
        ),
      })
      toast.success('Pregunta actualizada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar la pregunta: ${error.message}`)
    },
  })
}

// Delete question
export function useDeleteQuestion(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (questionId: number) =>
      questionService.deleteQuestion(
        academySlug,
        courseSlug,
        assessmentId,
        questionId
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(academySlug, courseSlug, assessmentId),
      })
      toast.success('Pregunta eliminada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar la pregunta: ${error.message}`)
    },
  })
}

// Reorder question
export function useReorderQuestion(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      questionId,
      position,
    }: {
      questionId: number
      position: number
    }) =>
      questionService.reorderQuestion(
        academySlug,
        courseSlug,
        assessmentId,
        questionId,
        position
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: questionKeys.list(academySlug, courseSlug, assessmentId),
      })
    },
    onError: (error: Error) => {
      toast.error(`Error al reordenar la pregunta: ${error.message}`)
    },
  })
}
