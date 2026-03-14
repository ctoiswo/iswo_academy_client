import { useNavigate } from '@tanstack/react-router'
import type { AccessCodeRedemptionResponse } from '@/types'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { AccessCodeRedemption } from '@/components/access-codes/access-code-redemption'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function RedeemAccessCodePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user, currentAcademy, refreshAcademies } = useAuthStore()

  const handleSuccess = async (_response: AccessCodeRedemptionResponse) => {
    // Refresh the academy list so the newly joined academy appears in the selector
    await refreshAcademies()
    navigate({ to: '/academy-selection' })
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      showSearch={false}
      variant='full'
    >
      <div className='container mx-auto max-w-2xl py-8'>
        {/* Title */}
        <div className='mb-8 text-center'>
          <h1 className='mb-4 text-3xl font-bold'>
            {t('accessCode.redeem.title')}
          </h1>
          <p className='text-muted-foreground'>
            {t('accessCode.redeem.description')}
          </p>
        </div>

        {/* Redemption component */}
        <AccessCodeRedemption onSuccess={handleSuccess} />

        {/* Help section */}
        <div className='text-muted-foreground mt-8 text-center text-sm'>
          <p>
            {t('accessCode.redeem.helpText')}
            <br />
            {t('common.no')}{' '}
            <Button
              variant='link'
              className='h-auto p-0 text-sm'
              onClick={() => navigate({ to: '/courses' })}
            >
              {t('accessCode.redeem.browseCourses')}
            </Button>
            .
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
