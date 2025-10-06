import { createFileRoute } from '@tanstack/react-router'
import { AcademiesPage } from '@/pages/academies'

export const Route = createFileRoute('/academies')({
  component: AcademiesPage,
})
