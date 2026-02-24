import { createFileRoute } from '@tanstack/react-router'
import { CreateAcademyLandingPage } from '@/features/landing/create-academy-landing'

export const Route = createFileRoute('/create-academy-landing/')({
  component: CreateAcademyLandingPage,
})
