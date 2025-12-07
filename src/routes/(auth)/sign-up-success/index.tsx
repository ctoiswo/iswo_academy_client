import { createFileRoute } from '@tanstack/react-router'
import { SignUpSuccess } from '@/features/auth/sign-up/success'
import { GuestGuard } from '@/components/route-guards'

function SignUpSuccessRoute() {
  return (
    <GuestGuard>
      <SignUpSuccess />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/sign-up-success/')({
  component: SignUpSuccessRoute,
})