import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/lessons'
)({
  component: () => <Outlet />,
})
