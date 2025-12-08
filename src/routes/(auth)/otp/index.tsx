import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { Otp } from '@/features/auth/otp'

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
