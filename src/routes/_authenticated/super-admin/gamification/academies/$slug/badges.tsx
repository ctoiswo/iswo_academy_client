import { createFileRoute } from '@tanstack/react-router'
import SuperAdminAcademyBadges from '@/pages/super-admin-academy-badges'

export const Route = createFileRoute(
  '/_authenticated/super-admin/gamification/academies/$slug/badges'
)({
  component: SuperAdminAcademyBadges,
})
