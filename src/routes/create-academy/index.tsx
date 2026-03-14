import { createFileRoute } from '@tanstack/react-router'
import { CreateAcademyPage } from '@/features/create-academy'

export const Route = createFileRoute('/create-academy/')({
  component: CreateAcademyPage,
})
