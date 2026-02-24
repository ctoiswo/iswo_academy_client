import { createFileRoute } from '@tanstack/react-router'
import { CoursesLandingPage } from '@/features/landing/courses-landing'

// Public courses landing page
export const Route = createFileRoute('/courses/')({
  component: CoursesLandingPage,
})
