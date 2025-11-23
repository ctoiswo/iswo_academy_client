import { createFileRoute } from '@tanstack/react-router'import { createFileRoute } from '@tanstack/react-router'import { createFileRoute } from '@tanstack/react-router'

import AssessmentQuestionsPage from '@/pages/assessment-questions'

import AssessmentQuestionsPage from '@/pages/assessment-questions'

export const Route = createFileRoute(

  '/academy/$academySlug/courses/$courseSlug/assessments/$assessmentId/questions'export const Route = createFileRoute(

)({

  component: AssessmentQuestionsPage,export const Route = createFileRoute(  '/academy/$academySlug/courses/$courseSlug/assessments/$assessmentId/questions',

})

  '/academy/$academySlug/courses/$courseSlug/assessments/$assessmentId/questions')({

)({  component: RouteComponent,

  component: AssessmentQuestionsPage,})

})

function RouteComponent() {
  return (
    <div>
      Hello
      "/academy/$academySlug/courses/$courseSlug/assessments/$assessmentId/questions"!
    </div>
  )
}
