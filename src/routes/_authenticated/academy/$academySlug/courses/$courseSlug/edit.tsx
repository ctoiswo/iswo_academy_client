import { createFileRoute } from '@tanstack/react-router'
import CourseEditPage from '@/pages/course-edit'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/edit'
)({
  component: CourseEditPage,
})
