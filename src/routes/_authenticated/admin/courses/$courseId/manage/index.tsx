import { createFileRoute } from '@tanstack/react-router'
import CourseManagementDetailPage from '@/pages/course-management-detail'

export const Route = createFileRoute(
  '/_authenticated/admin/courses/$courseId/manage/'
)({
  component: CourseManagementDetailPage,
})
