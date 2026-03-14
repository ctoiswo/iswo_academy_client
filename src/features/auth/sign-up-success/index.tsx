import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { Particles } from '@/components/ui/particles'
import { Navbar } from '@/components/common/navbar'
import { AnimatedCheck } from './components/animated-check'
import { HelpText } from './components/help-text'
import { ActionsSection } from './containers/actions-section'
import { EmailVerificationCard } from './containers/email-verification-card'
import { WhatsNextSection } from './containers/whats-next-section'

export function SignUpSuccess() {
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='bg-background relative flex min-h-screen flex-col overflow-hidden'>
      <Particles
        className='pointer-events-none fixed inset-0 z-0'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />

      <div className='relative z-10 flex flex-1 flex-col'>
        <Navbar />

        <main className='flex flex-1 items-center justify-center px-4 pt-20 pb-16'>
          <div className='flex w-full max-w-lg flex-col items-center gap-10 text-center'>
            {/* Animated check */}
            <div
              className={cn(
                'transition-all duration-700',
                mounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
              )}
            >
              <AnimatedCheck />
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
              <h1
                className='text-foreground text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('auth.signUpSuccess.title')}
              </h1>
              <p className='text-muted-foreground max-w-md text-base leading-relaxed'>
                {t('auth.signUpSuccess.subtitle')}
              </p>
            </div>

            <EmailVerificationCard mounted={mounted} />
            <WhatsNextSection mounted={mounted} />
            <ActionsSection mounted={mounted} />
            <HelpText mounted={mounted} onResend={() => {}} />
          </div>
        </main>
      </div>
    </div>
  )
}
