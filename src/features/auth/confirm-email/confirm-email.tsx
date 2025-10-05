import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'

type ConfirmationStatus =
  | 'loading'
  | 'success'
  | 'error'
  | 'already_confirmed'
  | 'expired'

export function ConfirmEmail() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/(auth)/confirm' })
  const [status, setStatus] = useState<ConfirmationStatus>('loading')
  const [message, setMessage] = useState('')
  const hasConfirmed = useRef(false)

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Token de confirmación no encontrado.')
        return
      }

      // Prevenir múltiples llamadas
      if (hasConfirmed.current) {
        return
      }

      hasConfirmed.current = true

      try {
        const response = await fetch(
          `http://localhost:3001/api/v1/auth/confirm/${token}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(
            '¡Tu email ha sido confirmado exitosamente! Ahora puedes iniciar sesión.'
          )
        } else {
          // Manejar diferentes tipos de errores
          switch (data.error?.code) {
            case 'INVALID_CONFIRMATION_TOKEN':
              setStatus('error')
              setMessage('Token de confirmación inválido.')
              break
            case 'ALREADY_CONFIRMED':
              setStatus('already_confirmed')
              setMessage(
                'Tu cuenta ya ha sido confirmada. Puedes iniciar sesión.'
              )
              break
            case 'EXPIRED_CONFIRMATION_TOKEN':
              setStatus('expired')
              setMessage(
                'El token de confirmación ha expirado. Solicita uno nuevo.'
              )
              break
            default:
              setStatus('error')
              setMessage(
                data.message || 'Ocurrió un error al confirmar tu email.'
              )
          }
        }
      } catch (error) {
        console.error('Error confirming email:', error)
        setStatus('error')
        setMessage('Error de conexión. Por favor, intenta nuevamente.')
      }
    }

    confirmEmail()
  }, [token])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className='h-16 w-16 animate-spin text-blue-500' />
      case 'success':
      case 'already_confirmed':
        return <CheckCircle className='h-16 w-16 text-green-500' />
      case 'error':
      case 'expired':
        return <XCircle className='h-16 w-16 text-red-500' />
      default:
        return null
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return 'Confirmando tu email...'
      case 'success':
        return '¡Email confirmado!'
      case 'already_confirmed':
        return 'Email ya confirmado'
      case 'error':
        return 'Error de confirmación'
      case 'expired':
        return 'Token expirado'
      default:
        return ''
    }
  }

  const handleGoToLogin = () => {
    navigate({ to: '/sign-in' })
  }

  const handleRequestNewToken = () => {
    // Aquí podrías implementar la lógica para solicitar un nuevo token
    // Por ahora, redirigimos al registro
    navigate({ to: '/sign-up' })
  }

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader className='text-center'>
          <div className='mb-4 flex justify-center'>{getStatusIcon()}</div>
          <CardTitle className='text-2xl font-bold'>
            {getStatusTitle()}
          </CardTitle>
          <CardDescription className='text-center'>{message}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {status === 'success' || status === 'already_confirmed' ? (
            <Button onClick={handleGoToLogin} className='w-full'>
              Iniciar Sesión
            </Button>
          ) : status === 'expired' ? (
            <div className='space-y-2'>
              <Button onClick={handleRequestNewToken} className='w-full'>
                Solicitar Nuevo Token
              </Button>
              <Button
                onClick={handleGoToLogin}
                variant='outline'
                className='w-full'
              >
                Ir a Iniciar Sesión
              </Button>
            </div>
          ) : status === 'error' ? (
            <div className='space-y-2'>
              <Button
                onClick={() => window.location.reload()}
                className='w-full'
              >
                Intentar Nuevamente
              </Button>
              <Button
                onClick={handleGoToLogin}
                variant='outline'
                className='w-full'
              >
                Ir a Iniciar Sesión
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
