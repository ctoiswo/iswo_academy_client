import { createFileRoute } from '@tanstack/react-router'
import MyCoursesPage from '@/pages/my-courses'

export const Route = createFileRoute('/_authenticated/my-courses')({
  component: MyCoursesPage,
})
