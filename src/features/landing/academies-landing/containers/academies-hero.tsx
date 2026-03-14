import type { AcademiesHeroProps } from '@/types/pages/academies-landing'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AcademiesHero({
  search,
  onSearchChange,
  totalAcademies,
}: AcademiesHeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative overflow-hidden pt-28 pb-16'>
      <div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center lg:px-8'>
        <div className='border-primary/20 bg-primary/5 text-primary flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium'>
          <span className='bg-primary size-1.5 animate-pulse rounded-full' />
          {t('academiesLanding.hero.badge', { count: totalAcademies })}
        </div>

        <h1
          className='text-foreground text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('academiesLanding.hero.title')}{' '}
          <span className='text-primary'>
            {t('academiesLanding.hero.titleHighlight')}
          </span>
        </h1>

        <p className='text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg'>
          {t('academiesLanding.hero.subtitle')}
        </p>

        <div className='relative mt-2 w-full max-w-xl'>
          <Search className='text-muted-foreground absolute top-1/2 left-4 size-4 -translate-y-1/2' />
          <input
            type='text'
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('academiesLanding.hero.searchPlaceholder')}
            className='border-border/60 bg-card/60 text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:ring-primary/10 h-12 w-full rounded-xl border pr-4 pl-11 text-sm backdrop-blur-sm transition-all focus:ring-2 focus:outline-none'
          />
        </div>
      </div>
    </section>
  )
}
