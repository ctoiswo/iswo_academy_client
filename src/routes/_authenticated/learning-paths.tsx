import { createFileRoute } from '@tanstack/react-router'
import LearningPathsPage from '@/pages/learning-paths'

export const Route = createFileRoute('/_authenticated/learning-paths')({
  component: LearningPathsPage,
})
