import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { ConfirmEmail } from '@/features/auth/confirm-email'

const searchSchema = z.object({
  token: z.string().optional(),
})

function ConfirmEmailRoute() {
  return (
    <GuestGuard>
      <ConfirmEmail />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/confirm/')({
  component: ConfirmEmailRoute,
  validateSearch: searchSchema,
})
