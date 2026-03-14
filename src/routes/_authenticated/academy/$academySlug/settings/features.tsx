import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { FeaturesConfigSettings } from '@/features/academy-settings/containers/features-config'

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/settings/features'
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
  component: FeaturesConfigSettings,
})
