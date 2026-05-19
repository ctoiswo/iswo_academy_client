import { createFileRoute } from '@tanstack/react-router'
import { Users } from 'lucide-react'
import { CourseSectionRedirect } from '@/components/teaching/course-section-redirect'

function TeachingStudentsPage() {
  return (
    <CourseSectionRedirect
      section='students'
      title='Mis Estudiantes'
      description='Consulta el progreso de estudiantes inscritos en tus cursos'
      icon={Users}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teaching/students'
)({
  component: TeachingStudentsPage,
})
