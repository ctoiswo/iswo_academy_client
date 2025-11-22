import { createFileRoute } from '@tanstack/react-router'
import { LearningPathAnalytics } from '@/pages/admin/learning-paths/analytics'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/analytics'
)({
  component: LearningPathAnalytics,
})
