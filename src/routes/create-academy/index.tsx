import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { CreateAcademyPage } from '@/features/create-academy'

const searchSchema = z.object({
  mode: z.enum(['login', 'create']).optional(),
})

export const Route = createFileRoute('/create-academy/')({
  validateSearch: searchSchema,
  component: CreateAcademyPage,
})
