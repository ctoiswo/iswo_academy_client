import { SuperAdminUsersPage } from '@/pages/super-admin-users'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/super-admin/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SuperAdminUsersPage />
}
