import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/dashboard/'
)({
  beforeLoad: ({ params }) => {
    const { currentAcademy } = useAuthStore.getState()
    const role = currentAcademy?.user_role
    const slug = params.academySlug

    if (role === 'admin' || role === 'owner') {
      throw redirect({
        to: `/academy/${slug}/dashboard/admin` as string,
        replace: true,
      })
    } else if (role === 'teacher') {
      throw redirect({
        to: `/academy/${slug}/dashboard/teacher` as string,
        replace: true,
      })
    } else {
      throw redirect({
        to: `/academy/${slug}/dashboard/student` as string,
        replace: true,
      })
    }
  },
})
