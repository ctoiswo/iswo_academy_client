import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/academy/$academyId/appearance')({
  component: () => <ComingSoon feature="Academy Appearance Settings" />,
})