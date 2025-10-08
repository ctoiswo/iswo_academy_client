import { createFileRoute } from '@tanstack/react-router'
import { PublicCoursePage } from '@/pages/public-course'

export const Route = createFileRoute('/courses/$courseSlug')({
  component: PublicCoursePage,
})
