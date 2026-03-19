import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import EditLessonPage from '@/pages/edit-lesson'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/lessons/$lessonId/edit'
)({
  validateSearch: z.object({
    sectionId: z.number(),
  }),
  component: EditLessonPage,
})
