import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function AcademyCta() {
  const { t } = useTranslation()

  return (
    <section className='relative overflow-hidden py-24'>
      {/* Background glow */}
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='bg-primary/10 absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]' />
      </div>

      <div className='mx-auto max-w-7xl px-4 lg:px-8'>
        <div className='border-primary/20 bg-card/60 relative flex flex-col items-center gap-8 overflow-hidden rounded-2xl border px-8 py-16 text-center backdrop-blur-sm sm:px-16 sm:py-20'>
          {/* Decorative corner glows */}
          <div className='bg-primary/5 pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full blur-[80px]' />
          <div className='bg-primary/5 pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full blur-[80px]' />

          <div className='relative z-10 flex flex-col items-center gap-6'>
            <div className='bg-primary/10 border-primary/20 flex size-14 items-center justify-center rounded-xl border'>
              <Zap className='text-primary size-7' />
            </div>

            <div className='flex flex-col items-center gap-3'>
              <h2
                className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t('createAcademyLanding.cta.title')}
                <br />
                <span className='from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent'>
                  {t('createAcademyLanding.cta.titleHighlight')}
                </span>
              </h2>

              <p className='text-muted-foreground max-w-lg text-sm leading-relaxed sm:text-base'>
                {t('createAcademyLanding.cta.subtitle')}
              </p>
            </div>

            <div className='flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row'>
              <Button asChild size='lg' className='w-full gap-2 px-8 sm:w-auto'>
                <Link to='/sign-in'>
                  <Zap className='size-4' />
                  {t('createAcademyLanding.cta.primaryCta')}
                </Link>
              </Button>
              <Button
                asChild
                size='lg'
                variant='outline'
                className='w-full px-8 sm:w-auto'
              >
                <a href='#precios'>
                  {t('createAcademyLanding.cta.secondaryCta')}
                </a>
              </Button>
            </div>

            <p className='text-muted-foreground text-xs'>
              {t('createAcademyLanding.cta.footnote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
