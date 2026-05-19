import { createFileRoute } from '@tanstack/react-router'
import { ClipboardList } from 'lucide-react'
import { CourseSectionRedirect } from '@/components/teaching/course-section-redirect'

function TeachingAssignmentsPage() {
  return (
    <CourseSectionRedirect
      section='assignments'
      title='Tareas'
      description='Gestiona tareas y actividades de tus cursos'
      icon={ClipboardList}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teaching/assignments'
)({
  component: TeachingAssignmentsPage,
})
