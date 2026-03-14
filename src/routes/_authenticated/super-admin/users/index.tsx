import { createFileRoute } from '@tanstack/react-router'
import { SuperAdminUsersPage } from '@/pages/super-admin-users'

export const Route = createFileRoute('/_authenticated/super-admin/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SuperAdminUsersPage />
}
