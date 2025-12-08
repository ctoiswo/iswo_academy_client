import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '@/pages/landing'
import { GuestGuard } from '@/components/route-guards'

function LandingRoute() {
  return (
    <GuestGuard>
      <LandingPage />
    </GuestGuard>
  )
}

export const Route = createFileRoute('/landing/')({
  component: LandingRoute,
})
