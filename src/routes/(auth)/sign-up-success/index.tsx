import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { SignUpSuccess } from '@/features/auth/sign-up-success'

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
