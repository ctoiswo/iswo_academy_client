import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AcademyUsersPage } from '@/features/academy-users'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/users'
)({
  beforeLoad: ({ params }) => {
    const { currentAcademy } = useAuthStore.getState()
    const role = currentAcademy?.user_role
    if (role !== 'admin' && role !== 'owner') {
      throw redirect({
        to: `/academy/${params.academySlug}/dashboard` as string,
      })
    }
  },
  component: () => <AcademyUsersPage defaultRole='all' />,
})
