'use client'

import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Lock,
  CheckCircle2,
  KeyRound,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'

function AnimatedShield() {
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
        <ShieldCheck
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

export function PasswordChangedSuccess() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const securityTips = [
    {
      icon: Lock,
      title: t('auth.passwordChanged.tipSecureTitle'),
      desc: t('auth.passwordChanged.tipSecureDesc'),
    },
    {
      icon: KeyRound,
      title: t('auth.passwordChanged.tip2FATitle'),
      desc: t('auth.passwordChanged.tip2FADesc'),
    },
    {
      icon: CheckCircle2,
      title: t('auth.passwordChanged.tipSessionsTitle'),
      desc: t('auth.passwordChanged.tipSessionsDesc'),
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
          {/* Animated icon */}
          <div
            className={cn(
              'transition-all duration-700',
              mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
            )}
          >
            <AnimatedShield />
          </div>

          {/* Main message */}
          <div
            className={cn(
              'flex flex-col items-center gap-4 transition-all delay-300 duration-700',
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
          >
            <div className='border-primary/20 bg-primary/5 text-primary flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium'>
              <span className='bg-primary size-1.5 animate-pulse rounded-full' />
              {t('auth.passwordChanged.securityBadge')}
            </div>
            <h1
              className='text-foreground text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl'
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('auth.passwordChanged.title')}
            </h1>
            <p className='text-muted-foreground max-w-md text-base leading-relaxed'>
              {t('auth.passwordChanged.desc')}
            </p>
          </div>

          {/* Security info card */}
          <div
            className={cn(
              'border-border/50 bg-card/60 w-full rounded-2xl border p-6 backdrop-blur-sm transition-all delay-500 duration-700',
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
          >
            <div className='flex flex-col items-center gap-4'>
              <div className='bg-primary/10 border-primary/20 flex size-12 items-center justify-center rounded-full border'>
                <ShieldCheck className='text-primary size-6' />
              </div>
              <div className='flex flex-col items-center gap-2'>
                <h2
                  className='text-foreground text-lg font-semibold'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('auth.passwordChanged.protectedTitle')}
                </h2>
                <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
                  {t('auth.passwordChanged.protectedDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Security tips */}
          <div
            className={cn(
              'flex w-full flex-col gap-4 transition-all delay-700 duration-700',
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
          >
            <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
              {t('auth.passwordChanged.tipsLabel')}
            </p>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
              {securityTips.map((item, i) => (
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
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            )}
          >
            <Link to='/sign-in' className='w-full'>
              <Button
                size='lg'
                className='bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-full gap-2 text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
              >
                {t('auth.passwordChanged.signInNow')}
                <ArrowRight className='size-4' />
              </Button>
            </Link>
            <Link to='/' className='w-full'>
              <Button
                variant='ghost'
                size='lg'
                className='text-muted-foreground hover:text-foreground h-11 w-full text-sm transition-colors'
              >
                {t('auth.passwordChanged.goHome')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
