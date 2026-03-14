import { createFileRoute } from '@tanstack/react-router'
import { AcademySettings } from '@/features/academy-settings'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/settings'
)({
  component: AcademySettings,
})
