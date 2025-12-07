import { Link, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnimatedAuthLayout } from '../components/animated-auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'

export function ResetPassword() {
  const { t } = useTranslation()
  const search = useSearch({ from: '/(auth)/reset-password/' })
  const token = search.token as string

  if (!token) {
    return (
      <AnimatedAuthLayout
        title={t('auth.resetPassword.invalidLink.layoutTitle')}
        subtitle={t('auth.resetPassword.invalidLink.layoutSubtitle')}
      >
        <Card className='gap-4'>
          <CardHeader>
            <CardTitle className='text-destructive text-lg tracking-tight'>
              {t('auth.resetPassword.invalidLink.title')}
            </CardTitle>
            <CardDescription>
              {t('auth.resetPassword.invalidLink.description')}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <div className='w-full text-center'>
              <Link
                to='/forgot-password'
                className='hover:text-primary underline underline-offset-4'
              >
                {t('auth.resetPassword.invalidLink.requestNew')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </AnimatedAuthLayout>
    )
  }

  return (
    <AnimatedAuthLayout
      title={t('auth.resetPassword.layoutTitle')}
      subtitle={t('auth.resetPassword.layoutSubtitle')}
    >
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            {t('auth.resetPassword.title')}
          </CardTitle>
          <CardDescription>{t('auth.resetPassword.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
            {t('auth.resetPassword.rememberPassword')}{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              {t('auth.resetPassword.signIn')}
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AnimatedAuthLayout>
  )
}
