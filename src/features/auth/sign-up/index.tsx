import { useSearch } from '@tanstack/react-router'
import { AuthLayout } from '../containers/auth-layout'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  const { redirect } = useSearch({ from: '/(auth)/sign-up/' })

  return (
    <AuthLayout side='signup'>
      <SignUpForm redirectTo={redirect} />
    </AuthLayout>
  )
}
