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
  const { user, currentAcademy } = useAuthStore()

  const handleSuccess = (response: AccessCodeRedemptionResponse) => {
    // After successful redemption, navigate to the course lessons
    navigate({
      to: '/academy/$academySlug/courses/$courseSlug/lessons',
      params: {
        academySlug: response.course.academy.slug,
        courseSlug: response.course.slug,
      },
    })
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
          <p className='text-gray-600'>{t('accessCode.redeem.description')}</p>
        </div>

        {/* Redemption component */}
        <AccessCodeRedemption onSuccess={handleSuccess} />

        {/* Help section */}
        <div className='mt-8 text-center text-sm text-gray-500'>
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
