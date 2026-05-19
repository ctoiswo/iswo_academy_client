import { createFileRoute } from '@tanstack/react-router'
import { LayoutList } from 'lucide-react'
import { CourseSectionRedirect } from '@/components/teaching/course-section-redirect'

function TeachingLessonsPage() {
  return (
    <CourseSectionRedirect
      section='lessons'
      title='Mis Lecciones'
      description='Gestiona lecciones y secciones de tus cursos'
      icon={LayoutList}
    />
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teaching/lessons'
)({
  component: TeachingLessonsPage,
})
