import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearch, Link } from '@tanstack/react-router'
import {
  MailCheck,
  XCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Rocket,
  BookOpen,
  Users,
  Trophy,
} from 'lucide-react'
import { getErrorMessage } from '@/lib/error-handler'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'

type ConfirmationStatus = 'loading' | 'success' | 'error'

function AnimatedMailCheck() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className='relative'>
      <div
        className='bg-primary/10 absolute inset-[-16px] animate-ping rounded-full'
        style={{ animationDuration: '2s' }}
      />
      <div className='bg-primary/20 absolute inset-[-8px] animate-pulse rounded-full blur-xl' />
      <div
        className={cn(
          'relative flex size-28 items-center justify-center rounded-full border-2 transition-all duration-700',
          show
            ? 'bg-primary/10 border-primary/40 scale-100'
            : 'bg-primary/5 border-primary/10 scale-75'
        )}
      >
        <MailCheck
          className={cn(
            'text-primary size-14 transition-all delay-200 duration-500',
            show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          )}
        />
      </div>
      <Sparkles
        className={cn(
          'text-primary absolute -top-3 -right-3 size-5 transition-all delay-500 duration-500',
          show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}
      />
      <Sparkles
        className={cn(
          'text-primary/60 absolute -bottom-2 -left-4 size-4 transition-all delay-700 duration-500',
          show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}
      />
      <Sparkles
        className={cn(
          'text-primary/40 absolute top-0 -left-5 size-3 transition-all delay-[900ms] duration-500',
          show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}
      />
    </div>
  )
}

export function ConfirmEmail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/(auth)/confirm/' })
  const [status, setStatus] = useState<ConfirmationStatus>('loading')
  const [message, setMessage] = useState('')
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const hasConfirmed = useRef(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage(t('auth.confirmEmail.errors.noToken'))
        setErrorCode('MISSING_CONFIRMATION_TOKEN')
        return
      }

      if (hasConfirmed.current) return
      hasConfirmed.current = true

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/auth/confirm/${token}`,
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
          const errorMessage = getErrorMessage(data.error)
          setStatus('error')
          setMessage(errorMessage)
          setErrorCode(data.error?.code || null)
        }
      } catch (error) {
        setStatus('error')
        setMessage(getErrorMessage(error))
        setErrorCode('NETWORK_ERROR')
      }
    }

    confirmEmail()
  }, [token, t])

  const handleGoToLogin = () => {
    const pending = sessionStorage.getItem('postAuthRedirect')
    if (pending) {
      navigate({ to: '/sign-in', search: { redirect: pending } })
    } else {
      navigate({ to: '/sign-in' })
    }
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const isExpiredError = errorCode === 'EXPIRED_CONFIRMATION_TOKEN'
  const canRetry = status === 'error' && !isExpiredError

  const features = [
    {
      icon: BookOpen,
      title: t('auth.confirmEmail.featureExplore'),
      desc: t('auth.confirmEmail.featureExploreDesc'),
    },
    {
      icon: Users,
      title: t('auth.confirmEmail.featureJoin'),
      desc: t('auth.confirmEmail.featureJoinDesc'),
    },
    {
      icon: Trophy,
      title: t('auth.confirmEmail.featureCertify'),
      desc: t('auth.confirmEmail.featureCertifyDesc'),
    },
  ]

  return (
    <div className='bg-background relative flex min-h-screen flex-col overflow-hidden'>
      {/* Background grid */}
      <div
        className='pointer-events-none fixed inset-0 opacity-[0.025]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden='true'
      />

      {/* Top glow */}
      <div
        className='bg-primary pointer-events-none fixed top-0 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full opacity-15 blur-[130px]'
        aria-hidden='true'
      />

      {/* Bottom glow */}
      <div
        className='bg-primary pointer-events-none fixed bottom-0 left-1/2 h-[200px] w-[400px] -translate-x-1/2 rounded-full opacity-10 blur-[100px]'
        aria-hidden='true'
      />

      {/* Nav */}
      <header className='relative z-10 flex items-center justify-between px-6 py-5 sm:px-10'>
        <Link to='/' className='group flex items-center gap-2.5'>
          <div className='bg-primary/10 border-primary/20 group-hover:border-primary/40 flex size-9 items-center justify-center rounded-xl border transition-colors'>
            <GraduationCap className='text-primary size-5' />
          </div>
          <span
            className='text-foreground text-lg font-bold tracking-tight'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ISWO<span className='text-primary'>Academy</span>
          </span>
        </Link>
      </header>

      {/* Main */}
      <main className='relative z-10 flex flex-1 items-center justify-center px-4 pb-16'>
        <div className='flex w-full max-w-lg flex-col items-center gap-10 text-center'>
          {/* Loading state */}
          {status === 'loading' && (
            <div className='flex flex-col items-center gap-6'>
              <div className='bg-primary/10 border-primary/20 flex size-28 items-center justify-center rounded-full border-2'>
                <Loader2 className='text-primary size-14 animate-spin' />
              </div>
              <p className='text-muted-foreground text-base'>
                {t('auth.confirmEmail.loading')}
              </p>
            </div>
          )}

          {/* Success state */}
          {status === 'success' && (
            <>
              {/* Animated icon */}
              <div
                className={cn(
                  'transition-all duration-700',
                  mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                )}
              >
                <AnimatedMailCheck />
              </div>

              {/* Main message */}
              <div
                className={cn(
                  'flex flex-col items-center gap-4 transition-all delay-300 duration-700',
                  mounted
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                )}
              >
                <div className='border-primary/20 bg-primary/5 text-primary flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium'>
                  <span className='bg-primary size-1.5 animate-pulse rounded-full' />
                  {t('auth.confirmEmail.verifiedBadge')}
                </div>
                <h1
                  className='text-foreground text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('auth.confirmEmail.successTitle')}
                </h1>
                <p className='text-muted-foreground max-w-md text-base leading-relaxed'>
                  {message || t('auth.confirmEmail.successDesc')}
                </p>
              </div>

              {/* Rocket card */}
              <div
                className={cn(
                  'border-border/50 bg-card/60 w-full rounded-2xl border p-6 backdrop-blur-sm transition-all delay-500 duration-700',
                  mounted
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                )}
              >
                <div className='flex flex-col items-center gap-4'>
                  <div className='bg-primary/10 border-primary/20 flex size-12 items-center justify-center rounded-full border'>
                    <Rocket className='text-primary size-6' />
                  </div>
                  <div className='flex flex-col items-center gap-2'>
                    <h2
                      className='text-foreground text-lg font-semibold'
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {t('auth.confirmEmail.rocketTitle')}
                    </h2>
                    <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
                      {t('auth.confirmEmail.rocketDesc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features grid */}
              <div
                className={cn(
                  'flex w-full flex-col gap-4 transition-all delay-700 duration-700',
                  mounted
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                )}
              >
                <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
                  {t('auth.confirmEmail.nowYouCan')}
                </p>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
                  {features.map((item, i) => (
                    <div
                      key={item.title}
                      className={cn(
                        'border-border/30 bg-card/40 hover:border-primary/20 hover:bg-card/60 flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-500',
                        mounted
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-4 opacity-0'
                      )}
                      style={{ transitionDelay: `${800 + i * 100}ms` }}
                    >
                      <item.icon className='text-primary/70 size-5' />
                      <span className='text-foreground text-sm font-semibold'>
                        {item.title}
                      </span>
                      <span className='text-muted-foreground text-xs'>
                        {item.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div
                className={cn(
                  'flex w-full max-w-xs flex-col gap-3 transition-all delay-[1000ms] duration-700',
                  mounted
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                )}
              >
                <Button
                  onClick={handleGoToLogin}
                  size='lg'
                  className='bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full gap-2 text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
                >
                  {t('auth.confirmEmail.goToLogin')}
                  <ArrowRight className='size-4' />
                </Button>
                <Link to='/' className='w-full'>
                  <Button
                    variant='ghost'
                    size='lg'
                    className='text-muted-foreground hover:text-foreground h-11 w-full text-sm transition-colors'
                  >
                    {t('auth.confirmEmail.goHome')}
                  </Button>
                </Link>
              </div>
            </>
          )}

          {/* Error state */}
          {status === 'error' && (
            <>
              <div
                className={cn(
                  'transition-all duration-700',
                  mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
                )}
              >
                <div className='relative'>
                  <div className='bg-destructive/15 absolute inset-[-8px] animate-pulse rounded-full blur-xl' />
                  <div className='bg-destructive/10 border-destructive/30 relative flex size-28 items-center justify-center rounded-full border-2'>
                    <XCircle className='text-destructive size-14' />
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  'flex flex-col items-center gap-4 transition-all delay-300 duration-700',
                  mounted
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                )}
              >
                <h1
                  className='text-foreground text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('auth.confirmEmail.errorTitle')}
                </h1>
                <p className='text-muted-foreground max-w-md text-base leading-relaxed'>
                  {message}
                </p>
              </div>

              <div
                className={cn(
                  'flex w-full max-w-xs flex-col gap-3 transition-all delay-500 duration-700',
                  mounted
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0'
                )}
              >
                {canRetry && (
                  <Button
                    onClick={handleRetry}
                    size='lg'
                    className='bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full gap-2 text-sm font-semibold transition-all duration-300'
                  >
                    {t('auth.confirmEmail.retry')}
                  </Button>
                )}
                <Button
                  onClick={handleGoToLogin}
                  variant='outline'
                  size='lg'
                  className='h-11 w-full text-sm'
                >
                  {t('auth.confirmEmail.goToLogin')}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
