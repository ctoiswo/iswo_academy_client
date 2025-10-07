import { createFileRoute } from '@tanstack/react-router'
import { PublicAcademyPage } from '@/pages/public-academy'

export const Route = createFileRoute('/public/academies/$academySlug')({
  component: PublicAcademyPage,
})
