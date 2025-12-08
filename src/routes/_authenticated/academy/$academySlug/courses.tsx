import { createFileRoute, Outlet } from '@tanstack/react-router'

function CoursesLayoutRoute() {
  return <Outlet />
}

export const Route = createFileRoute('/_authenticated/academy/$academySlug/courses')({
  component: CoursesLayoutRoute,
})
