import { useCallback, useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonService } from '@/services/lesson-service'
import { toast } from 'sonner'

const TRACK_INTERVAL_MS = 30_000 // report every 30 s while reading

/**
 * Returns the set of lesson IDs the current user has completed for a course,
 * and helpers to mark a lesson complete or track reading progress.
 *
 * `completedIds` is derived from the *lesson* query cache — each lesson's
 * `user_progress.completed` flag is already returned by the GET lesson
 * endpoint.  We build the set from what is already in cache so there is no
 * extra network request; it gets updated automatically when mutations fire.
 */
export function useLessonTracker(academySlug: string, courseSlug: string) {
  const queryClient = useQueryClient()

  // ── Mark as completed ────────────────────────────────────────────────────
  const completeMutation = useMutation({
    mutationFn: (lessonId: number) =>
      lessonService.completeLesson(academySlug, courseSlug, lessonId),
    onSuccess: (data, lessonId) => {
      // Update every cached lesson query that matches this lesson
      queryClient.setQueriesData<any>(
        { predicate: (q) => q.queryKey.includes(lessonId) },
        (old: any) => {
          if (!old) return old
          return { ...old, user_progress: data }
        }
      )
      queryClient.invalidateQueries({
        queryKey: ['lesson', academySlug, courseSlug],
      })
      toast.success('¡Lección completada!')
    },
    onError: () => {
      toast.error('No se pudo guardar el progreso. Inténtalo de nuevo.')
    },
  })

  // ── Track reading progress ────────────────────────────────────────────────
  const trackMutation = useMutation({
    mutationFn: ({
      lessonId,
      payload,
    }: {
      lessonId: number
      payload: {
        time_increment?: number
        video_position?: number
        video_duration?: number
      }
    }) => lessonService.trackProgress(academySlug, courseSlug, lessonId, payload),
    onSuccess: (data, { lessonId }) => {
      queryClient.setQueriesData<any>(
        { predicate: (q) => q.queryKey.includes(lessonId) },
        (old: any) => {
          if (!old) return old
          return { ...old, user_progress: data }
        }
      )
    },
  })

  const { mutate: completeMutate } = completeMutation

  const { mutate: trackMutate } = trackMutation

  const markComplete = useCallback(
    (lessonId: number, onSuccess?: () => void) => {
      completeMutate(lessonId, { onSuccess })
    },
    [completeMutate]
  )

  const trackProgress = useCallback(
    (
      lessonId: number,
      payload: {
        time_increment?: number
        video_position?: number
        video_duration?: number
      }
    ) => {
      trackMutate({ lessonId, payload })
    },
    [trackMutate]
  )

  return {
    markComplete,
    trackProgress,
    isCompleting: completeMutation.isPending,
  }
}

/**
 * Periodically reports reading time for text/document lessons while the
 * component is mounted.  Call this inside ReadingContent / DocumentContent.
 */
export function useReadingTracker(
  academySlug: string,
  courseSlug: string,
  lessonId: number,
  enabled: boolean
) {
  const { trackProgress } = useLessonTracker(academySlug, courseSlug)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!enabled || !lessonId) return

    intervalRef.current = setInterval(() => {
      trackProgress(lessonId, { time_increment: TRACK_INTERVAL_MS / 1000 })
    }, TRACK_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [enabled, lessonId, trackProgress])
}
