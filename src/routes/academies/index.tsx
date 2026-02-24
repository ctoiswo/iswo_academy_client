import { createFileRoute } from '@tanstack/react-router'
import { AcademiesLandingPage } from '@/features/landing/academies-landing'

export const Route = createFileRoute('/academies/')({
  component: AcademiesLandingPage,
})
