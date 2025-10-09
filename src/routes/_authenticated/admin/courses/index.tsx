import { createFileRoute } from '@tanstack/react-router'
import CoursesManagementPage from '@/pages/courses-management'

export const Route = createFileRoute('/_authenticated/admin/courses/')({
  component: CoursesManagementPage,
})