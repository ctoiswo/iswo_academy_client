import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/super-admin')({
  component: SuperAdminLayout,
})

function SuperAdminLayout() {
  return <Outlet />
}
