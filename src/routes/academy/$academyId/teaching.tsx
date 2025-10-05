import { createFileRoute } from '@tanstack/react-router'
import { AcademyGuard } from '@/components/route-guards'
import { ComingSoon } from '@/components/coming-soon'

function TeachingRoute() {
  const { academyId } = Route.useParams()
  
  return (
    <AcademyGuard academyId={academyId} requiredRole="teacher">
      <ComingSoon feature="Teaching Dashboard" />
    </AcademyGuard>
  )
}

export const Route = createFileRoute('/academy/$academyId/teaching')({
  component: TeachingRoute,
})