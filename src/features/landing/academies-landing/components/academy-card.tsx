import { Link } from '@tanstack/react-router'
import { type AcademySummaryLight } from '@/types'
import { BookOpen, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { getCategoryIcon, getGradientByIndex } from '../utils/category-styles'

interface AcademyCardProps {
  academy: AcademySummaryLight
  index: number
}

export function AcademyCard({ academy, index }: AcademyCardProps) {
  const { t } = useTranslation()
  const catSlug = academy.academy_category?.slug ?? ''
  const Icon = getCategoryIcon(catSlug)
  const { from, to } = getGradientByIndex(index)
  const creatorName = academy.creator?.name ?? ''

  return (
    <article className='group border-border/40 bg-secondary/20 hover:border-primary/30 hover:bg-secondary/40 relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)]'>
      {/* Banner image / accent bar */}
      <div className='relative h-28 w-full shrink-0 overflow-hidden'>
        {academy.banner_url ? (
          <img
            src={academy.banner_url}
            alt={academy.name}
            className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        ) : (
          <div className={cn('h-full w-full bg-gradient-to-br', from, to)} />
        )}
        <div className='absolute inset-0 bg-black/20' />
      </div>

      <div className='flex flex-col gap-3 p-5'>
        {/* Icon + name */}
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br',
              from,
              to
            )}
          >
            <Icon className='text-foreground size-5' />
          </div>
          <div className='flex min-w-0 flex-col'>
            <h3
              className='text-foreground line-clamp-1 text-sm leading-snug font-semibold'
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {academy.name}
            </h3>
            {academy.academy_category?.name && (
              <span className='text-muted-foreground text-[10px]'>
                {academy.academy_category.name}
              </span>
            )}
          </div>
        </div>

        {academy.description && (
          <p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>
            {academy.description}
          </p>
        )}

        {creatorName && (
          <p className='text-muted-foreground/70 text-xs'>
            {t('academiesLanding.card.by')}{' '}
            <span className='text-foreground/60 font-medium'>
              {creatorName}
            </span>
          </p>
        )}

        <div className='text-muted-foreground border-border/20 flex items-center gap-4 border-t pt-2 text-[11px]'>
          <span className='flex items-center gap-1'>
            <BookOpen className='size-3' />
            {academy.courses_count} {t('academiesLanding.card.courses')}
          </span>
          <span className='flex items-center gap-1'>
            <Users className='size-3' />
            {new Intl.NumberFormat('es').format(academy.enrolled_users_count)}
          </span>
        </div>

        <Link to='/academies/$slug' params={{ slug: academy.slug }}>
          <button className='border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 mt-1 flex h-8 w-full items-center justify-center rounded-lg border text-xs font-medium transition-colors'>
            {t('academiesLanding.card.viewAcademy')}
          </button>
        </Link>
      </div>
    </article>
  )
}
