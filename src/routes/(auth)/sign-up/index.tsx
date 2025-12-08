import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { SignUp } from '@/features/auth/sign-up'

function SignUpRoute() {
  return (
    <GuestGuard>
      <SignUp />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/sign-up/')({
  component: SignUpRoute,
})
