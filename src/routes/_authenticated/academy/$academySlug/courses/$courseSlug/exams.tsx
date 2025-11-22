import { createFileRoute } from '@tanstack/react-router'
import CourseExamsPage from '@/pages/course-exams'

export const Route = createFileRoute('/_authenticated/academy/$academySlug/courses/$courseSlug/exams')({
  component: CourseExamsPage,
})
