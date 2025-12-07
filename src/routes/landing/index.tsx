import { createFileRoute } from '@tanstack/react-router'
import { GuestGuard } from '@/components/route-guards'
import { LandingPage } from '@/pages/landing'

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
