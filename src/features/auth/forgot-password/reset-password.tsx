import { Link, useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'

export function ResetPassword() {
  const search = useSearch({ from: '/(auth)/reset-password' })
  const token = search.token as string

  if (!token) {
    return (
      <AuthLayout>
        <Card className='gap-4'>
          <CardHeader>
            <CardTitle className='text-lg tracking-tight text-destructive'>
              Invalid Reset Link
            </CardTitle>
            <CardDescription>
              The password reset link is invalid or missing. Please request a new password reset.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="w-full text-center">
              <Link
                to='/forgot-password'
                className='hover:text-primary underline underline-offset-4'
              >
                Request new password reset
              </Link>
            </div>
          </CardFooter>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Reset Your Password
          </CardTitle>
          <CardDescription>
            Enter your new password below. Make sure it's strong and secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
            Remember your password?{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              Sign in
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}