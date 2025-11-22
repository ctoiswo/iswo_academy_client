import { createFileRoute } from '@tanstack/react-router'
import { LearningPathPricing } from '@/pages/admin/learning-paths/pricing'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/pricing'
)({
  component: LearningPathPricing,
})
