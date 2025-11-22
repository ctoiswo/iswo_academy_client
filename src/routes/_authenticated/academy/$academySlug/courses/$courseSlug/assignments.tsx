import { createFileRoute } from '@tanstack/react-router'
import CourseAssignmentsPage from '@/pages/course-assignments'

export const Route = createFileRoute('/_authenticated/academy/$academySlug/courses/$courseSlug/assignments')({
  component: CourseAssignmentsPage,
})
