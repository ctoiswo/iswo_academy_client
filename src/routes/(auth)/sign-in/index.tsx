import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { SignIn } from '@/features/auth/sign-in'

const searchSchema = z.object({
  redirect: z.string().optional(),
  error: z.string().optional(),
})

function SignInRoute() {
  return (
    <GuestGuard>
      <SignIn />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/sign-in/')({
  component: SignInRoute,
  validateSearch: searchSchema,
})
