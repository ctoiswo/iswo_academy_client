import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/academy/$academyId/messages')({
  component: () => <ComingSoon feature="Academy Messages" />,
})