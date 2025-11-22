import { createFileRoute } from '@tanstack/react-router'
import { LearningPathUnlockConfig } from '@/pages/admin/learning-paths/unlock-config'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/unlock-config'
)({
  component: LearningPathUnlockConfig,
})
