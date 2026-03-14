import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function AcademiesCta() {
  const { t } = useTranslation()

  return (
    <div className='border-border/40 bg-card/40 relative mt-16 overflow-hidden rounded-2xl border backdrop-blur-sm'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='bg-primary absolute top-[-40%] left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full opacity-10 blur-[100px]' />
      </div>
      <div className='relative z-10 flex flex-col items-center justify-between gap-6 px-8 py-10 sm:flex-row'>
        <div className='flex flex-col gap-2 text-center sm:text-left'>
          <h3
            className='text-foreground text-2xl font-bold'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('academiesLanding.cta.title')}
          </h3>
          <p className='text-muted-foreground text-sm'>
            {t('academiesLanding.cta.description')}
          </p>
        </div>
        <Link to='/create-academy-landing' className='shrink-0'>
          <Button
            size='lg'
            className='bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all'
          >
            {t('academiesLanding.cta.button')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
