import { createFileRoute } from '@tanstack/react-router'
import { TermsOfService } from '@/features/legal/terms'

function TermsRoute() {
  return <TermsOfService />
}

export const Route = createFileRoute('/terms/')({
  component: TermsRoute,
})
