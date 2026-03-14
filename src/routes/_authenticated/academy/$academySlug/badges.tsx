import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AcademyBadgesPage } from '@/features/academy-badges'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/badges'
)({
  beforeLoad: ({ params }) => {
    const role = useAuthStore.getState().currentAcademy?.user_role
    if (role !== 'admin' && role !== 'owner') {
      throw redirect({
        to: `/academy/${params.academySlug}/dashboard` as string,
        search: {} as never,
      })
    }
  },
  component: AcademyBadgesPage,
})
