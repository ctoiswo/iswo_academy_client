import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/academy/$academyId/achievements')({
  component: () => <ComingSoon feature="Academy Achievements" />,
})