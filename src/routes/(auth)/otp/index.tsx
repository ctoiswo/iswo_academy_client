import { createFileRoute } from '@tanstack/react-router'
import { Otp } from '@/features/auth/otp'
import { GuestGuard } from '@/components/route-guards'

function OtpRoute() {
  return (
    <GuestGuard>
      <Otp />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/(auth)/otp/')({
  component: OtpRoute,
})
