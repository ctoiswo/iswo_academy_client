import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnimatedAuthLayout } from '../components/animated-auth-layout'

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 200,
        damping: 15,
      },
    },
  }

  return (
    <AnimatedAuthLayout
      title='Confirmación de Email'
      subtitle='Estamos verificando tu correo electrónico para activar tu cuenta en ISWO Academy'
      showBackButton={false}
    >
      <motion.div
        variants={cardVariants}
        initial='hidden'
        animate='visible'
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <Card className='gap-4 border-0 bg-white/95 shadow-xl backdrop-blur-sm'>
          <motion.div variants={headerVariants}>
            <CardHeader className='pb-4 text-center'>
              <motion.div
                className='mb-6 flex justify-center'
                variants={iconVariants}
              >
                {getStatusIcon()}
              </motion.div>
              <CardTitle className='text-2xl font-bold tracking-tight text-gray-900'>
                {getStatusTitle()}
              </CardTitle>
              <CardDescription className='mt-2 text-base text-gray-600'>
                {message}
              </CardDescription>
            </CardHeader>
          </motion.div>

          <motion.div variants={contentVariants} transition={{ delay: 0.2 }}>
            <CardContent className='space-y-3 px-6 pb-6'>
              {status === 'success' || status === 'already_confirmed' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={handleGoToLogin}
                    className='w-full'
                    size='lg'
                  >
                    Iniciar Sesión
                  </Button>
                </motion.div>
              ) : status === 'expired' ? (
                <motion.div
                  className='space-y-3'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={handleRequestNewToken}
                    className='w-full'
                    size='lg'
                  >
                    Solicitar Nuevo Token
                  </Button>
                  <Button
                    onClick={handleGoToLogin}
                    variant='outline'
                    className='w-full'
                    size='lg'
                  >
                    Ir a Iniciar Sesión
                  </Button>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div
                  className='space-y-3'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={() => window.location.reload()}
                    className='w-full'
                    size='lg'
                  >
                    Intentar Nuevamente
                  </Button>
                  <Button
                    onClick={handleGoToLogin}
                    variant='outline'
                    className='w-full'
                    size='lg'
                  >
                    Ir a Iniciar Sesión
                  </Button>
                </motion.div>
              ) : null}
            </CardContent>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatedAuthLayout>
  )
}
