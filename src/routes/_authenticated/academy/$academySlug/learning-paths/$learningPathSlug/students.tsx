import { createFileRoute } from '@tanstack/react-router'
import { LearningPathStudents } from '@/pages/admin/learning-paths/students'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/students'
)({
  component: LearningPathStudents,
})
