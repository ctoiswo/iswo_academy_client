import { createFileRoute } from '@tanstack/react-router'
import { AcademySelectionPage } from '@/pages/academy-selection'
import { AuthGuard } from '@/components/route-guards'

function AcademySelectionRoute() {
  return (
    <AuthGuard>
      <AcademySelectionPage />
    </AuthGuard>
  )
}

export const Route = createFileRoute('/academy-selection')({
  component: AcademySelectionRoute,
})
