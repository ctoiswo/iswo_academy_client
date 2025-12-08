import { createFileRoute } from '@tanstack/react-router'
import CourseCertificatesPage from '@/pages/course-certificates'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/courses/$courseSlug/certificates'
)({
  component: CourseCertificatesPage,
})
