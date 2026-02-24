import { useEffect } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AuthLayout } from '../containers/auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect, error } = useSearch({ from: '/(auth)/sign-in/' })
  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error))
      // Remove the error from the URL without adding a history entry
      navigate({ to: '/sign-in', search: redirect ? { redirect } : {}, replace: true })
    }
  }, [error, redirect, navigate])

  return (
    <AuthLayout side='signin'>
      <UserAuthForm redirectTo={redirect} />
    </AuthLayout>
  )
}
