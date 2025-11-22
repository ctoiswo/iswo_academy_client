import { createFileRoute } from '@tanstack/react-router'
import AssessmentQuestionsPage from '@/pages/assessment-questions'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/assessments/$assessmentId/questions/'
)({
  component: AssessmentQuestionsPage,
})
