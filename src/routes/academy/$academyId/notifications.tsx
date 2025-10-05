import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/academy/$academyId/notifications')({
  component: () => <ComingSoon feature="Academy Notification Settings" />,
})