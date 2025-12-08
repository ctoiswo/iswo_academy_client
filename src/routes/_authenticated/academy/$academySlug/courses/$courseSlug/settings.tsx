import { createFileRoute } from '@tanstack/react-router'
import CourseSettingsPage from '@/pages/course-settings'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/settings'
)({
  component: CourseSettingsPage,
})
