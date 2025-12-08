import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { getErrorMessage } from '@/lib/error-handler'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnimatedAuthLayout } from '../components/animated-auth-layout'

type ConfirmationStatus = 'loading' | 'success' | 'error'

export function ConfirmEmail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/(auth)/confirm/' })
  const [status, setStatus] = useState<ConfirmationStatus>('loading')
  const [message, setMessage] = useState('')
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const hasConfirmed = useRef(false)

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage(t('auth.confirmEmail.errors.noToken'))
        setErrorCode('MISSING_CONFIRMATION_TOKEN')
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
              'X-Locale': localStorage.getItem('locale') || 'es',
            },
          }
        )

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message || t('auth.confirmEmail.success'))
        } else {
          // El backend ya envía user_message traducido
          const errorMessage = getErrorMessage(data.error)
          setStatus('error')
          setMessage(errorMessage)
          setErrorCode(data.error?.code || null)
        }
      } catch (error) {
        // console.error('Error confirming email:', error)
        setStatus('error')
        setMessage(getErrorMessage(error))
        setErrorCode('NETWORK_ERROR')
      }
    }

    confirmEmail()
  }, [token, t])

  const getStatusIcon = () => {
    if (status === 'loading') {
      return <Loader2 className='h-16 w-16 animate-spin text-blue-500' />
    }
    if (status === 'success') {
      return <CheckCircle className='h-16 w-16 text-green-500' />
    }
    return <XCircle className='h-16 w-16 text-red-500' />
  }

  const getStatusTitle = () => {
    if (status === 'loading') return t('auth.confirmEmail.loading')
    if (status === 'success') return t('auth.confirmEmail.successTitle')
    return t('auth.confirmEmail.errorTitle')
  }

  const handleGoToLogin = () => {
    navigate({ to: '/sign-in' })
  }

  const handleRetry = () => {
    window.location.reload()
  }

  // Determinar si mostrar botón de "Solicitar nuevo token"
  const isExpiredError = errorCode === 'EXPIRED_CONFIRMATION_TOKEN'
  const canRetry = status === 'error' && !isExpiredError

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
      title={t('auth.confirmEmail.title')}
      subtitle={t('auth.confirmEmail.subtitle')}
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
              {status === 'success' ? (
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
                    {t('auth.confirmEmail.goToLogin')}
                  </Button>
                </motion.div>
              ) : status === 'error' ? (
                <motion.div
                  className='space-y-3'
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {canRetry && (
                    <Button onClick={handleRetry} className='w-full' size='lg'>
                      {t('auth.confirmEmail.retry')}
                    </Button>
                  )}
                  <Button
                    onClick={handleGoToLogin}
                    variant='outline'
                    className='w-full'
                    size='lg'
                  >
                    {t('auth.confirmEmail.goToLogin')}
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
