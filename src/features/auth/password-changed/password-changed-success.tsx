'use client'

import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Lock,
  CheckCircle2,
  KeyRound,
} from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'

function AnimatedShield() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className='relative'>
      <div
        className='absolute inset-[-16px] rounded-full bg-primary/10 animate-ping'
        style={{ animationDuration: '2s' }}
      />
      <div className='absolute inset-[-8px] rounded-full bg-primary/20 blur-xl animate-pulse' />
      <div
        className={cn(
          'relative flex items-center justify-center size-28 rounded-full border-2 transition-all duration-700',
          show
            ? 'bg-primary/10 border-primary/40 scale-100'
            : 'bg-primary/5 border-primary/10 scale-75'
        )}
      >
        <ShieldCheck
          className={cn(
            'size-14 text-primary transition-all duration-500 delay-200',
            show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          )}
        />
      </div>
      <Sparkles
        className={cn(
          'absolute -top-3 -right-3 size-5 text-primary transition-all duration-500 delay-500',
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
      />
      <Sparkles
        className={cn(
          'absolute -bottom-2 -left-4 size-4 text-primary/60 transition-all duration-500 delay-700',
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
      />
      <Sparkles
        className={cn(
          'absolute top-0 -left-5 size-3 text-primary/40 transition-all duration-500 delay-[900ms]',
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
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
    <div className='min-h-screen flex flex-col bg-background relative overflow-hidden'>
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
        className='pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] opacity-15 blur-[130px] rounded-full bg-primary'
        aria-hidden='true'
      />

      {/* Nav */}
      <header className='relative z-10 flex items-center justify-between px-6 py-5 sm:px-10'>
        <Link to='/' className='flex items-center gap-2.5 group'>
          <div className='flex items-center justify-center size-9 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors'>
            <GraduationCap className='size-5 text-primary' />
          </div>
          <span
            className='text-lg font-bold text-foreground tracking-tight'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ISWO<span className='text-primary'>Academy</span>
          </span>
        </Link>
      </header>

      {/* Main */}
      <main className='relative z-10 flex-1 flex items-center justify-center px-4 pb-16'>
        <div className='flex flex-col items-center gap-10 w-full max-w-lg text-center'>
          {/* Animated icon */}
          <div
            className={cn(
              'transition-all duration-700',
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            )}
          >
            <AnimatedShield />
          </div>

          {/* Main message */}
          <div
            className={cn(
              'flex flex-col items-center gap-4 transition-all duration-700 delay-300',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <div className='flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium'>
              <span className='size-1.5 rounded-full bg-primary animate-pulse' />
              {t('auth.passwordChanged.securityBadge')}
            </div>
            <h1
              className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance leading-tight'
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('auth.passwordChanged.title')}
            </h1>
            <p className='text-base text-muted-foreground leading-relaxed max-w-md'>
              {t('auth.passwordChanged.desc')}
            </p>
          </div>

          {/* Security info card */}
          <div
            className={cn(
              'w-full rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 transition-all duration-700 delay-500',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <div className='flex flex-col items-center gap-4'>
              <div className='flex items-center justify-center size-12 rounded-full bg-primary/10 border border-primary/20'>
                <ShieldCheck className='size-6 text-primary' />
              </div>
              <div className='flex flex-col items-center gap-2'>
                <h2
                  className='text-lg font-semibold text-foreground'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('auth.passwordChanged.protectedTitle')}
                </h2>
                <p className='text-sm text-muted-foreground leading-relaxed max-w-sm'>
                  {t('auth.passwordChanged.protectedDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* Security tips */}
          <div
            className={cn(
              'w-full flex flex-col gap-4 transition-all duration-700 delay-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <p className='text-xs font-medium text-muted-foreground uppercase tracking-wider'>
              {t('auth.passwordChanged.tipsLabel')}
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              {securityTips.map((item, i) => (
                <div
                  key={item.title}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border border-border/30 bg-card/40 transition-all duration-500 hover:border-primary/20 hover:bg-card/60',
                    mounted
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  )}
                  style={{ transitionDelay: `${800 + i * 100}ms` }}
                >
                  <item.icon className='size-5 text-primary/70' />
                  <span className='text-sm font-semibold text-foreground'>
                    {item.title}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div
            className={cn(
              'flex flex-col gap-3 w-full max-w-xs transition-all duration-700 delay-[1000ms]',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <Link to='/sign-in' className='w-full'>
              <Button
                size='lg'
                className='w-full h-12 text-sm font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] transition-all duration-300'
              >
                {t('auth.passwordChanged.signInNow')}
                <ArrowRight className='size-4' />
              </Button>
            </Link>
            <Link to='/' className='w-full'>
              <Button
                variant='ghost'
                size='lg'
                className='w-full h-11 text-sm text-muted-foreground hover:text-foreground transition-colors'
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
