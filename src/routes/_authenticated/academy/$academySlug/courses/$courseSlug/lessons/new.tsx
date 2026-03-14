import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import CreateLessonPage from '@/pages/create-lesson'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/lessons/new'
)({
  validateSearch: z.object({
    sectionId: z.number(),
  }),
  component: CreateLessonPage,
})
