import { createFileRoute } from '@tanstack/react-router'
import { PublicAcademyPage } from '@/pages/public-academy'

export const Route = createFileRoute('/academies/$slug')({
  component: PublicAcademyPage,
})
