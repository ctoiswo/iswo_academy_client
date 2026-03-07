import { SuperAdminPaymentsPage } from '@/pages/super-admin-payments'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/super-admin/payments/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SuperAdminPaymentsPage />
}
