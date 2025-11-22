import { createFileRoute } from '@tanstack/react-router'
import { LearningPathSettings } from '@/pages/admin/learning-paths/settings'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/settings'
)({
  component: LearningPathSettings,
})
