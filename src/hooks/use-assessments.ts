import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assessmentService } from '@/services/assessment-service'
import type {
  AssessmentType,
  CreateAssessmentRequest,
  UpdateAssessmentRequest,
  SubmitAnswer,
} from '@/types'
import { toast } from 'sonner'

const RAILS_FIELD_TRANSLATIONS: Record<string, string> = {
  'time limit minutes': 'Tiempo límite',
  title: 'Título',
  'passing score': 'Puntaje mínimo',
  'attempts allowed': 'Intentos permitidos',
  'weight percentage': 'Peso',
  section: 'Sección',
}

const RAILS_ERROR_TRANSLATIONS: Record<string, string> = {
  blank: 'es obligatorio',
  'not a number': 'debe ser un número',
  'greater than 0': 'debe ser mayor a 0',
  'less than or equal to 100': 'debe ser 100 o menos',
  'is not included in the list': 'no es válido',
}

function translateRailsErrors(errors: string[]): string {
  return errors
    .map((err) => {
      const lower = err.toLowerCase()
      // Buscar campo
      let translated = err
      for (const [field, fieldEs] of Object.entries(RAILS_FIELD_TRANSLATIONS)) {
        if (lower.startsWith(field)) {
          for (const [msg, msgEs] of Object.entries(RAILS_ERROR_TRANSLATIONS)) {
            if (lower.includes(msg)) {
              translated = `${fieldEs} ${msgEs}`
              break
            }
          }
          break
        }
      }
      // Si contiene "Translation missing" no mostrar el ruido
      if (translated.includes('Translation missing')) {
        for (const [field, fieldEs] of Object.entries(
          RAILS_FIELD_TRANSLATIONS
        )) {
          if (lower.startsWith(field)) {
            if (lower.includes('blank'))
              translated = `${fieldEs} es obligatorio`
            else if (
              lower.includes('not_a_number') ||
              lower.includes('not a number')
            )
              translated = `${fieldEs} debe ser un número`
            break
          }
        }
      }
      return translated
    })
    .join('\n')
}

function extractErrorMessage(error: Error): string {
  const axiosError = error as any
  const errors = axiosError?.response?.data?.errors
  if (Array.isArray(errors) && errors.length > 0) {
    return translateRailsErrors(errors)
  }
  return error.message
}

// Query keys
export const assessmentKeys = {
  all: ['assessments'] as const,
  lists: () => [...assessmentKeys.all, 'list'] as const,
  list: (
    academySlug: string,
    courseSlug: string,
    filters?: Record<string, unknown>
  ) => [...assessmentKeys.lists(), academySlug, courseSlug, filters] as const,
  details: () => [...assessmentKeys.all, 'detail'] as const,
  detail: (academySlug: string, courseSlug: string, assessmentId: number) =>
    [
      ...assessmentKeys.details(),
      academySlug,
      courseSlug,
      assessmentId,
    ] as const,
  statistics: (academySlug: string, courseSlug: string, assessmentId: number) =>
    [
      ...assessmentKeys.all,
      'statistics',
      academySlug,
      courseSlug,
      assessmentId,
    ] as const,
  attempts: (
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    status?: string
  ) =>
    [
      ...assessmentKeys.all,
      'attempts',
      academySlug,
      courseSlug,
      assessmentId,
      status,
    ] as const,
}

// Get all assessments for a course
export function useAssessments(
  academySlug: string,
  courseSlug: string,
  params?: {
    type?: AssessmentType
    section_id?: number
    status?: 'published' | 'draft'
  }
) {
  return useQuery({
    queryKey: assessmentKeys.list(academySlug, courseSlug, params),
    queryFn: () =>
      assessmentService.getAssessments(academySlug, courseSlug, params),
    enabled: !!academySlug && !!courseSlug,
  })
}

// Get a single assessment
export function useAssessment(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  return useQuery({
    queryKey: assessmentKeys.detail(academySlug, courseSlug, assessmentId),
    queryFn: () =>
      assessmentService.getAssessment(academySlug, courseSlug, assessmentId),
    enabled: !!academySlug && !!courseSlug && !!assessmentId,
  })
}

// Get assessment statistics
export function useAssessmentStatistics(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  return useQuery({
    queryKey: assessmentKeys.statistics(academySlug, courseSlug, assessmentId),
    queryFn: () =>
      assessmentService.getStatistics(academySlug, courseSlug, assessmentId),
    enabled: !!academySlug && !!courseSlug && !!assessmentId,
  })
}

// Get assessment attempts
export function useAssessmentAttempts(
  academySlug: string,
  courseSlug: string,
  assessmentId: number,
  status?: 'completed' | 'in_progress'
) {
  return useQuery({
    queryKey: assessmentKeys.attempts(
      academySlug,
      courseSlug,
      assessmentId,
      status
    ),
    queryFn: () =>
      assessmentService.getAttempts(
        academySlug,
        courseSlug,
        assessmentId,
        status
      ),
    enabled: !!academySlug && !!courseSlug && !!assessmentId,
  })
}

// Create assessment
export function useCreateAssessment(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAssessmentRequest) =>
      assessmentService.createAssessment(academySlug, courseSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() })
      toast.success('Evaluación creada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(`Error al crear la evaluación: ${extractErrorMessage(error)}`)
    },
  })
}

// Update assessment
export function useUpdateAssessment(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateAssessmentRequest) =>
      assessmentService.updateAssessment(
        academySlug,
        courseSlug,
        assessmentId,
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.detail(academySlug, courseSlug, assessmentId),
      })
      toast.success('Evaluación actualizada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(
        `Error al actualizar la evaluación: ${extractErrorMessage(error)}`
      )
    },
  })
}

// Delete assessment
export function useDeleteAssessment(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (assessmentId: number) =>
      assessmentService.deleteAssessment(academySlug, courseSlug, assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assessmentKeys.lists() })
      toast.success('Evaluación eliminada exitosamente')
    },
    onError: (error: Error) => {
      toast.error(
        `Error al eliminar la evaluación: ${extractErrorMessage(error)}`
      )
    },
  })
}

// ─── Student quiz-taking hooks ────────────────────────────────────────────────

export const myAttemptsKey = (
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) =>
  ['assessments', 'my_attempts', academySlug, courseSlug, assessmentId] as const

export function useMyAttempts(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  return useQuery({
    queryKey: myAttemptsKey(academySlug, courseSlug, assessmentId),
    queryFn: () =>
      assessmentService.getMyAttempts(academySlug, courseSlug, assessmentId),
    enabled: !!academySlug && !!courseSlug && !!assessmentId,
  })
}

export function useStartAttempt(academySlug: string, courseSlug: string) {
  return useMutation({
    mutationFn: (assessmentId: number) =>
      assessmentService.startAttempt(academySlug, courseSlug, assessmentId),
    onError: (error: Error) => {
      toast.error(`Error al iniciar el quiz: ${error.message}`)
    },
  })
}

export function useSubmitAttempt(
  academySlug: string,
  courseSlug: string,
  assessmentId: number
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      attemptId,
      answers,
    }: {
      attemptId: number
      answers: SubmitAnswer[]
    }) =>
      assessmentService.submitAttempt(
        academySlug,
        courseSlug,
        assessmentId,
        attemptId,
        answers
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: myAttemptsKey(academySlug, courseSlug, assessmentId),
      })
      queryClient.invalidateQueries({
        queryKey: assessmentKeys.list(academySlug, courseSlug),
      })
    },
    onError: (error: Error) => {
      toast.error(`Error al enviar el quiz: ${error.message}`)
    },
  })
}
