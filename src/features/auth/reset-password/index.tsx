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
import { AuthLayout } from '../containers/auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'

export function ResetPassword() {
  const { t } = useTranslation()
  const search = useSearch({ from: '/(auth)/reset-password/' })
  const token = search.token as string

  if (!token) {
    return (
      <AuthLayout side='signin'>
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
      </AuthLayout>
    )
  }

  return (
    <AuthLayout side='signin'>
      <ResetPasswordForm token={token} />
    </AuthLayout>
  )
}
