import { createFileRoute } from '@tanstack/react-router'
import { AcademyGuard } from '@/components/route-guards'
import { AcademyLayout } from '@/components/layout/academy-layout'

function AcademyRoute() {
  const { academyId } = Route.useParams()
  
  return (
    <AcademyGuard academyId={academyId}>
      <AcademyLayout />
    </AcademyGuard>
  )
}

export const Route = createFileRoute('/academy/$academyId')({
  component: AcademyRoute,
})