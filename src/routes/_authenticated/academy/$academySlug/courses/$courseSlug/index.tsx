import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/academy/$academySlug/courses/$courseSlug/')({
  beforeLoad: ({ params }) => {
    // Redirigir automáticamente a la pestaña de información
    throw redirect({
      to: '/academy/$academySlug/courses/$courseSlug/info',
      params: { academySlug: params.academySlug, courseSlug: params.courseSlug },
    })
  },
})
