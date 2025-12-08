import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { ForgotPassword } from '@/features/auth/forgot-password'

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
