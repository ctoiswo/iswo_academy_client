import { createFileRoute } from '@tanstack/react-router'
import { AuthGuard } from '@/components/route-guards'
import { AcademiesPage } from '@/features/academies'

function AcademiesRoute() {
  return (
    <AuthGuard>
      <AcademiesPage />
    </AuthGuard>
  )
}

export const Route = createFileRoute('/academies')({
  component: AcademiesRoute,
})
