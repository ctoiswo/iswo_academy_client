import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/(auth)/auth/callback')({
  component: OAuthCallbackPage,
})

function OAuthCallbackPage() {
  const navigate = useNavigate()
  const { setTokens, refreshUser } = useAuthStore()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const error = params.get('error')

      if (error) {
        toast.error(decodeURIComponent(error))
        navigate({ to: '/sign-in', replace: true })
        return
      }

      if (accessToken && refreshToken) {
        try {
          // Store tokens first
          setTokens({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: 3600, // 1 hour in seconds
          })

          // Then load user data and academies
          await refreshUser()

          toast.success('Sesión iniciada correctamente')
          navigate({ to: '/academies', replace: true })
        } catch (err) {
          console.error('Error loading user data:', err)
          toast.error('Error al cargar datos del usuario')
          navigate({ to: '/sign-in', replace: true })
        }
      } else {
        toast.error('Error al procesar autenticación')
        navigate({ to: '/sign-in', replace: true })
      }
    }

    handleOAuthCallback()
  }, [navigate, setTokens, refreshUser])

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <Loader2 className='text-primary mx-auto h-8 w-8 animate-spin' />
        <p className='text-muted-foreground mt-4 text-sm'>
          Procesando autenticación...
        </p>
      </div>
    </div>
  )
}
