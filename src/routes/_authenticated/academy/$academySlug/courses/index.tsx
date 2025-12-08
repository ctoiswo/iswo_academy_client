import { createFileRoute } from '@tanstack/react-router'
import AcademyCourseCatalogPage from '@/pages/academy-course-catalog'

export const Route = createFileRoute('/_authenticated/academy/$academySlug/courses/')({
  component: AcademyCourseCatalogPage,
})
