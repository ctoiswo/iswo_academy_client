import { AuthLayout } from '../containers/auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'

export function ForgotPassword() {
  return (
    <AuthLayout side='signin'>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
