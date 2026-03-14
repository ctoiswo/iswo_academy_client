import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { SignUp } from '@/features/auth/sign-up'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

function SignUpRoute() {
  return (
    <GuestGuard>
      <SignUp />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/sign-up/')({
  component: SignUpRoute,
  validateSearch: searchSchema,
})
