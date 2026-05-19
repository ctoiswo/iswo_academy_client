import { createFileRoute } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'
import { CourseSectionRedirect } from '@/components/teaching/course-section-redirect'

function TeachingGradesPage() {
  return (
    <CourseSectionRedirect
      section='students'
      title='Calificaciones'
      description='Revisa el progreso y calificaciones de tus estudiantes'
      icon={GraduationCap}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teaching/grades'
)({
  component: TeachingGradesPage,
})
