import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { AuthGuard } from '@/components/route-guards'

function AuthenticatedRoute() {
  return (
    <AuthGuard>
      <AuthenticatedLayout />
    </AuthGuard>
  )
}

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedRoute,
})
