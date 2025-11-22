import { createFileRoute } from '@tanstack/react-router'
import { AcademyLearningPathsPage } from '@/pages/academy'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/learning-paths/'
)({
  component: AcademyLearningPathsPage,
})
