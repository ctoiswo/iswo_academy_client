import { createFileRoute } from '@tanstack/react-router'
import CourseLessonsPage from '@/pages/course-lessons'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/lessons'
)({
  component: CourseLessonsPage,
})
