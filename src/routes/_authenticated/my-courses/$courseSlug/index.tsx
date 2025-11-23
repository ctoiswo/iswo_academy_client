import { createFileRoute } from '@tanstack/react-router'
import { StudentCoursePage } from '@/pages/student-course'

export const Route = createFileRoute('/_authenticated/my-courses/$courseSlug/')({
  component: StudentCoursePage,
})
