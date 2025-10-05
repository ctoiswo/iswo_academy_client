import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/academy/$academyId/teaching/assignments')({
  component: () => <ComingSoon feature="Teaching Assignments" />,
})