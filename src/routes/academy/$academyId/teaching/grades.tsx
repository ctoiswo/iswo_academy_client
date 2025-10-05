import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/academy/$academyId/teaching/grades')({
  component: () => <ComingSoon feature="Teaching Grades" />,
})