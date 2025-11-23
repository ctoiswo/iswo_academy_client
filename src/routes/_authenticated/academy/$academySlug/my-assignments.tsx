import { createFileRoute } from '@tanstack/react-router'
import MyAssignmentsPage from '@/pages/my-assignments'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/my-assignments'
)({
  component: MyAssignmentsPage,
})
