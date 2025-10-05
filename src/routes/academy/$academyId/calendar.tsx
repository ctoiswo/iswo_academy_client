import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/academy/$academyId/calendar')({
  component: () => <ComingSoon feature="Academy Calendar" />,
})