import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPolicy } from '@/features/legal/privacy'

function PrivacyRoute() {
  return <PrivacyPolicy />
}

export const Route = createFileRoute('/privacy/')({
  component: PrivacyRoute,
})
