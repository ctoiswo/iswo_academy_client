import { createFileRoute } from '@tanstack/react-router'
import { ForgotPassword } from '@/features/auth/forgot-password'
import { GuestGuard } from '@/components/route-guards'

function ForgotPasswordRoute() {
  return (
    <GuestGuard>
      <ForgotPassword />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/forgot-password/')({
  component: ForgotPasswordRoute,
})
