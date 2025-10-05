import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'
import { AcademyGuard } from '@/components/route-guards'

function AcademySettingsRoute() {
  const { academyId } = Route.useParams()
  
  return (
    <AcademyGuard academyId={academyId} requiredRole="admin">
      <ComingSoon feature="Academy Settings" />
    </AcademyGuard>
  )
}

export const Route = createFileRoute('/academy/$academyId/settings')({
  component: AcademySettingsRoute,
})