import { createFileRoute } from '@tanstack/react-router'
import { SuperAdminHealthPage } from '@/pages/super-admin-health'

export const Route = createFileRoute('/_authenticated/super-admin/health/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SuperAdminHealthPage />
}
