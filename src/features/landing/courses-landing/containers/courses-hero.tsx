import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CoursesHeroProps {
  search: string
  onSearchChange: (value: string) => void
  totalCourses: number
}

export function CoursesHero({ search, onSearchChange, totalCourses }: CoursesHeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative pt-28 pb-16 overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 lg:px-8 flex flex-col items-center gap-6 text-center'>
        <div className='flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium'>
          <span className='size-1.5 rounded-full bg-primary animate-pulse' />
          {t('coursesLanding.hero.badge', { count: totalCourses })}
        </div>

        <h1
          className='text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1] text-balance'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('coursesLanding.hero.title')}{' '}
          <span className='text-primary'>{t('coursesLanding.hero.titleHighlight')}</span>
        </h1>

        <p className='text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl'>
          {t('coursesLanding.hero.subtitle')}
        </p>

        <div className='relative w-full max-w-xl mt-2'>
          <Search className='absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
          <input
            type='text'
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t('coursesLanding.hero.searchPlaceholder')}
            className='w-full h-12 pl-11 pr-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all'
          />
        </div>
      </div>
    </section>
  )
}
