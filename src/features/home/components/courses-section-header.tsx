import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
        <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
          {t('pages.home.courses.eyebrow')}
        </span>
        <h2
          className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('pages.home.courses.title')}
        </h2>
        <p className='text-muted-foreground max-w-md text-sm leading-relaxed'>
          {t('pages.home.courses.subtitle')}
        </p>
      </div>
      <div className='hidden items-center gap-2 sm:flex'>
        <button
          onClick={onScrollLeft}
          disabled={!canScrollLeft}
          className='border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 flex size-9 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-30'
          aria-label={t('pages.home.courses.prevLabel')}
        >
          <ChevronLeft className='size-4' />
        </button>
        <button
          onClick={onScrollRight}
          disabled={!canScrollRight}
          className='border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 flex size-9 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-30'
          aria-label={t('pages.home.courses.nextLabel')}
        >
          <ChevronRight className='size-4' />
        </button>
      </div>
    </div>
  )
}
