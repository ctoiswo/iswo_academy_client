import { createFileRoute } from '@tanstack/react-router'
import MyBadgesPage from '@/pages/my-badges'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/my-badges'
)({
  component: MyBadgesPage,
})
