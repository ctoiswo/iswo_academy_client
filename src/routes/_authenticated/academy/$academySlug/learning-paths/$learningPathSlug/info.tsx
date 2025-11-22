import { createFileRoute } from '@tanstack/react-router'
import { LearningPathInfo } from '@/pages/admin/learning-paths/info'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/info'
)({
  component: LearningPathInfo,
})
