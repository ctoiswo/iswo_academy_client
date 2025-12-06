import { createFileRoute, Outlet } from '@tanstack/react-router'

function CourseLayoutRoute() {
  return <Outlet />
}

export const Route = createFileRoute('/academy/$academySlug/courses/$courseSlug')({
  component: CourseLayoutRoute,
})