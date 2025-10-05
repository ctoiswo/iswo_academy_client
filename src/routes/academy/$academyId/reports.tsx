import { createFileRoute } from '@tanstack/react-router'
import { AcademyGuard } from '@/components/route-guards'
import { ComingSoon } from '@/components/coming-soon'

function ReportsRoute() {
  const { academyId } = Route.useParams()
  
  return (
    <AcademyGuard academyId={academyId} requiredRole="admin">
      <ComingSoon feature="Academy Reports" />
    </AcademyGuard>
  )
}

export const Route = createFileRoute('/academy/$academyId/reports')({
  component: ReportsRoute,
})