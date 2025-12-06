import { createFileRoute } from '@tanstack/react-router'
import { PublicAcademiesPage } from '@/pages/public-academies'

export const Route = createFileRoute('/academies/')({
  component: PublicAcademiesPage,
})
