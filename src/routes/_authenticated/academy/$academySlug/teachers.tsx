import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { AcademyUsersPage } from '@/features/academy-users'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teachers'
)({
  beforeLoad: ({ params }) => {
    const { currentAcademy, user } = useAuthStore.getState()
    const role = currentAcademy?.user_role
    if (!user?.is_super_admin && role !== 'admin' && role !== 'owner') {
      throw redirect({
        to: `/academy/${params.academySlug}/dashboard` as string,
      })
    }
  },
  component: () => <AcademyUsersPage defaultRole='teacher' />,
})
