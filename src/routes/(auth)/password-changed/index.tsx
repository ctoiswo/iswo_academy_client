import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { PasswordChangedSuccess } from '@/features/auth/password-changed'

function PasswordChangedRoute() {
  return (
    <GuestGuard>
      <PasswordChangedSuccess />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/password-changed/')({
  component: PasswordChangedRoute,
})
