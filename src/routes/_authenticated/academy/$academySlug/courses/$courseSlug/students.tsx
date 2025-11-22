import { createFileRoute } from '@tanstack/react-router'
import CourseStudentsPage from '@/pages/course-students'

export const Route = createFileRoute('/_authenticated/academy/$academySlug/courses/$courseSlug/students')({
  component: CourseStudentsPage,
})
