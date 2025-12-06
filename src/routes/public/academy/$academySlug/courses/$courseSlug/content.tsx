import { createFileRoute } from '@tanstack/react-router'
import { PublicCourseContentPage } from '@/pages/public-course-content'

export const Route = createFileRoute(
  '/public/academy/$academySlug/courses/$courseSlug/content'
)({
  component: PublicCourseContentPage,
})
