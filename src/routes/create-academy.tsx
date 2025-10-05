import { createFileRoute } from '@tanstack/react-router'
import { ComingSoon } from '@/components/coming-soon'
import { AuthGuard } from '@/components/route-guards'

function CreateAcademyRoute() {
  return (
    <AuthGuard>
      <ComingSoon feature="Academy Creation" />
    </AuthGuard>
  )
}

export const Route = createFileRoute('/create-academy')({
  component: CreateAcademyRoute,
})