import { createFileRoute } from '@tanstack/react-router'
import CourseEnrollPage from '@/pages/course-enroll'

export const Route = createFileRoute('/courses/$courseSlug/enroll/')({
  component: CourseEnrollPage,
})
