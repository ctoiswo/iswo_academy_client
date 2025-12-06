import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/public/academy/$academySlug/courses/$courseSlug'
)({
  component: () => <Outlet />,
})
