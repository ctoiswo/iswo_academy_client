import { createFileRoute } from '@tanstack/react-router'
import { PublicAcademyPage } from '@/pages/public-academy'

export const Route = createFileRoute('/public/$academySlug')({
  component: PublicAcademyPage,
})
