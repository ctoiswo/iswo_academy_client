import { createFileRoute } from '@tanstack/react-router'
import { PublicCoursePage } from '@/pages/public-course'

export const Route = createFileRoute('/public/courses/$courseSlug')({
  component: PublicCoursePage,
})
