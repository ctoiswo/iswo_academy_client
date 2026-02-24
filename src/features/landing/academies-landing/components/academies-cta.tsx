import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function AcademiesCta() {
  const { t } = useTranslation()

  return (
    <div className='mt-16 relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm overflow-hidden'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute top-[-40%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] opacity-10 blur-[100px] rounded-full bg-primary' />
      </div>
      <div className='relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 py-10 px-8'>
        <div className='flex flex-col gap-2 text-center sm:text-left'>
          <h3
            className='text-2xl font-bold text-foreground'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('academiesLanding.cta.title')}
          </h3>
          <p className='text-sm text-muted-foreground'>
            {t('academiesLanding.cta.description')}
          </p>
        </div>
        <Link to='/create-academy-landing' className='shrink-0'>
          <Button
            size='lg'
            className='h-11 px-8 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all'
          >
            {t('academiesLanding.cta.button')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
