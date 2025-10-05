import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@/features/auth/sign-in'
import { GuestGuard } from '@/components/route-guards'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

function SignInRoute() {
  return (
    <GuestGuard>
      <SignIn />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignInRoute,
  validateSearch: searchSchema,
})
