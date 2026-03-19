import { Outlet, createFileRoute } from '@tanstack/react-router'

function LessonRouteLayout() {
  return <Outlet />
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/lessons/$lessonId'
)({
  component: LessonRouteLayout,
})
