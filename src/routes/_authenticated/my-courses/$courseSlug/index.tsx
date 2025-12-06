import StudentCourseContentPage from '@/pages/student-course-content'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/my-courses/$courseSlug/')({
  component: StudentCourseContentPage,
})
