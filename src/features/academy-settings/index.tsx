import {
  Outlet,
  useNavigate,
  useLocation,
  useParams,
} from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useTranslation } from '@/hooks/use-translation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export function AcademySettings() {
  const { user, currentAcademy } = useAuthStore()
  const { academySlug } = useParams({ strict: false })
  const slug = academySlug ?? ''
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const activeTab = pathname.includes('/features') ? 'features' : 'general'

  const handleTabChange = (value: string) => {
    if (value === 'features') {
      navigate({ to: `/academy/${slug}/settings/features` as string })
    } else {
      navigate({ to: `/academy/${slug}/settings/` as string })
    }
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      title={t('academySettings.title')}
      subtitle={t('academySettings.subtitle')}
    >
      <div className='space-y-6'>
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value='general'>
              {t('academySettings.tabs.general')}
            </TabsTrigger>
            <TabsTrigger value='features'>
              {t('academySettings.tabs.features')}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Outlet />
      </div>
    </DashboardLayout>
  )
}
