import { createFileRoute } from '@tanstack/react-router'
import { AcademyGuard } from '@/components/route-guards'
import { ComingSoon } from '@/components/coming-soon'

function AnalyticsRoute() {
  const { academyId } = Route.useParams()
  
  return (
    <AcademyGuard academyId={academyId} requiredRole="admin">
      <ComingSoon feature="Academy Analytics" />
    </AcademyGuard>
  )
}

export const Route = createFileRoute('/academy/$academyId/analytics')({
  component: AnalyticsRoute,
})