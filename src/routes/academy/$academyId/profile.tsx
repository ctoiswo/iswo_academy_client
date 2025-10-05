import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'

export const Route = createFileRoute('/academy/$academyId/profile')({
  component: () => <ComingSoon feature="Academy Profile Settings" />,
})