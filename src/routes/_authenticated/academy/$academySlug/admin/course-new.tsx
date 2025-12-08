import { createFileRoute } from '@tanstack/react-router'
import CourseNewPage from '@/pages/course-new'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/admin/course-new'
)({
  component: CourseNewPage,
})
