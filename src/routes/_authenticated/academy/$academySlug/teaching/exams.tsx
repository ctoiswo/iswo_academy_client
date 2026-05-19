import { createFileRoute } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'
import { CourseSectionRedirect } from '@/components/teaching/course-section-redirect'

function TeachingExamsPage() {
  return (
    <CourseSectionRedirect
      section='exams'
      title='Exámenes'
      description='Gestiona exámenes y evaluaciones de tus cursos'
      icon={FileQuestion}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teaching/exams'
)({
  component: TeachingExamsPage,
})
