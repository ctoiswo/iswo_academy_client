import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { GeneralInfoSettings } from '@/features/academy-settings/containers/general-info'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/settings/'
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
  component: GeneralInfoSettings,
})
