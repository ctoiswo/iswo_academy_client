import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/academy/$academyId/display')({
  component: () => <ComingSoon feature="Academy Display Settings" />,
})