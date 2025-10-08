import { createFileRoute } from '@tanstack/react-router'
import { CoursesPage } from '@/pages/courses'

// Public courses page - shows list of all courses
export const Route = createFileRoute('/courses/')({
  component: CoursesPage,
})
