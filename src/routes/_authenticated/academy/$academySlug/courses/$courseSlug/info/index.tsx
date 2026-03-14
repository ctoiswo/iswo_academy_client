import { createFileRoute } from '@tanstack/react-router'
import CourseInfoPage from '@/pages/course-info'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/info/'
)({
  component: CourseInfoPage,
})
