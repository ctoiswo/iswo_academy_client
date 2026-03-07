import { Outlet } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuthStore } from '@/stores/auth-store'
import { useTranslation } from '@/hooks/use-translation'

export function Settings() {
  const { user } = useAuthStore()
  const { t } = useTranslation()

  return (
    <DashboardLayout
      user={user}
      variant='full'
      title={t('settings.title')}
      subtitle={t('settings.subtitle')}
    >
      <Outlet />
    </DashboardLayout>
  )
}
