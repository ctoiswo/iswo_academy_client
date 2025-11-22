import { createFileRoute } from '@tanstack/react-router'
import { LearningPathCertificates } from '@/pages/admin/learning-paths/certificates'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/certificates'
)({
  component: LearningPathCertificates,
})
