import { createFileRoute } from '@tanstack/react-router'
import LearningPathsPage from '@/pages/learning-paths'

export const Route = createFileRoute('/_authenticated/admin/learning-paths')({
  component: LearningPathsPage,
})
