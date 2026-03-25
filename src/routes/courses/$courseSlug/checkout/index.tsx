import { createFileRoute } from '@tanstack/react-router'
import CourseCheckoutPage from '@/pages/course-checkout'

export const Route = createFileRoute('/courses/$courseSlug/checkout/')({
  component: CourseCheckoutPage,
})
