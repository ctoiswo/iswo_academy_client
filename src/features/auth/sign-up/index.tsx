import { AuthLayout } from '../containers/auth-layout'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  return (
    <AuthLayout side='signup'>
      <SignUpForm />
    </AuthLayout>
  )
}
