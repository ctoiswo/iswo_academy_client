import { SuperAdminHealthPage } from '@/pages/super-admin-health'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/super-admin/health/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SuperAdminHealthPage />
}
