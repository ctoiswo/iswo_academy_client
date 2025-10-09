import CourseManagementDetailPage from '@/pages/course-management-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/courses/$courseId/manage/')({
  component: CourseManagementDetailPage,
})