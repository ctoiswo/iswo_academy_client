import { createFileRoute } from '@tanstack/react-router'
import { LearningPathCourses } from '@/pages/admin/learning-paths/courses'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/courses'
)({
  component: LearningPathCourses,
})
