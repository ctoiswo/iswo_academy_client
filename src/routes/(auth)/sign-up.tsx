import { createFileRoute } from '@tanstack/react-router'
import { SignUp } from '@/features/auth/sign-up'
import { GuestGuard } from '@/components/route-guards'

function SignUpRoute() {
  return (
    <GuestGuard>
      <SignUp />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/sign-up')({
  component: SignUpRoute,
})
