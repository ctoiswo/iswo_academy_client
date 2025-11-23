import { createFileRoute } from '@tanstack/react-router'
import StudentCourseContentPage from '@/pages/student-course-content'

export const Route = createFileRoute('/_authenticated/academy/$academySlug/courses/$courseSlug/content')({
  component: StudentCourseContentPage,
})
