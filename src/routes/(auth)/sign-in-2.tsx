import { createFileRoute } from '@tanstack/react-router'
import { SignIn2 } from '@/features/auth/sign-in/sign-in-2'
import { GuestGuard } from '@/components/route-guards'

function SignIn2Route() {
  return (
    <GuestGuard>
      <SignIn2 />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/sign-in-2')({
  component: SignIn2Route,
})
