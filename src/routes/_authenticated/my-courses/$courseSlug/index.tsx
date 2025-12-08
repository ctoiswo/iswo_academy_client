import { createFileRoute } from '@tanstack/react-router'
import StudentCourseContentPage from '@/pages/student-course-content'

export const Route = createFileRoute('/_authenticated/my-courses/$courseSlug/')(
  {
    component: StudentCourseContentPage,
  }
)
