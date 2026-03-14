import { createFileRoute } from '@tanstack/react-router'
import { SuperAdminPaymentsPage } from '@/pages/super-admin-payments'

export const Route = createFileRoute('/_authenticated/super-admin/payments/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SuperAdminPaymentsPage />
}
