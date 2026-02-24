import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { Navbar } from '@/components/common/navbar'
import { Particles } from '@/components/ui/particles'
import { AnimatedCheck } from './components/animated-check'
import { HelpText } from './components/help-text'
import { EmailVerificationCard } from './containers/email-verification-card'
import { WhatsNextSection } from './containers/whats-next-section'
import { ActionsSection } from './containers/actions-section'

export function SignUpSuccess() {
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='min-h-screen flex flex-col bg-background relative overflow-hidden'>
      <Particles
        className='fixed inset-0 z-0 pointer-events-none'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />

      <div className='relative z-10 flex flex-col flex-1'>
        <Navbar />

        <main className='flex-1 flex items-center justify-center px-4 pb-16 pt-20'>
          <div className='flex flex-col items-center gap-10 w-full max-w-lg text-center'>

            {/* Animated check */}
            <div
              className={cn(
                'transition-all duration-700',
                mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              )}
            >
              <AnimatedCheck />
            </div>

            {/* Main message */}
            <div
              className={cn(
                'flex flex-col items-center gap-4 transition-all duration-700 delay-300',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
            >
              <h1
                className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance leading-tight'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('auth.signUpSuccess.title')}
              </h1>
              <p className='text-base text-muted-foreground leading-relaxed max-w-md'>
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
