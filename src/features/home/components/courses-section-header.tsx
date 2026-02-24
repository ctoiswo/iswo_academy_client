import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CoursesSectionHeaderProps {
  canScrollLeft: boolean
  canScrollRight: boolean
  onScrollLeft: () => void
  onScrollRight: () => void
}

export function CoursesSectionHeader({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
}: CoursesSectionHeaderProps) {
  const { t } = useTranslation()
  return (
    <div className='flex items-end justify-between gap-4'>
      <div className='flex flex-col gap-3'>
        <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
          {t('pages.home.courses.eyebrow')}
        </span>
        <h2
          className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('pages.home.courses.title')}
        </h2>
        <p className='text-sm text-muted-foreground max-w-md leading-relaxed'>
          {t('pages.home.courses.subtitle')}
        </p>
      </div>
      <div className='hidden sm:flex items-center gap-2'>
        <button
          onClick={onScrollLeft}
          disabled={!canScrollLeft}
          className='flex items-center justify-center size-9 rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
          aria-label={t('pages.home.courses.prevLabel')}
        >
          <ChevronLeft className='size-4' />
        </button>
        <button
          onClick={onScrollRight}
          disabled={!canScrollRight}
          className='flex items-center justify-center size-9 rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed'
          aria-label={t('pages.home.courses.nextLabel')}
        >
          <ChevronRight className='size-4' />
        </button>
      </div>
    </div>
  )
}
