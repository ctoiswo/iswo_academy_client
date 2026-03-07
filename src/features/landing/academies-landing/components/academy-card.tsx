import { Link } from '@tanstack/react-router'
import { BookOpen, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { type AcademySummaryLight } from '@/types'
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
    <article className='group relative flex flex-col rounded-xl border border-border/40 bg-secondary/20 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:bg-secondary/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)] hover:-translate-y-0.5'>
      {/* Banner image / accent bar */}
      <div className='relative h-28 w-full overflow-hidden shrink-0'>
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
          <div className={cn('flex items-center justify-center size-10 rounded-xl bg-gradient-to-br shrink-0', from, to)}>
            <Icon className='size-5 text-foreground' />
          </div>
          <div className='flex flex-col min-w-0'>
            <h3
              className='text-sm font-semibold text-foreground leading-snug line-clamp-1'
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {academy.name}
            </h3>
            {academy.academy_category?.name && (
              <span className='text-[10px] text-muted-foreground'>
                {academy.academy_category.name}
              </span>
            )}
          </div>
        </div>

        {academy.description && (
          <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
            {academy.description}
          </p>
        )}

        {creatorName && (
          <p className='text-xs text-muted-foreground/70'>
            {t('academiesLanding.card.by')}{' '}
            <span className='text-foreground/60 font-medium'>{creatorName}</span>
          </p>
        )}

        <div className='flex items-center gap-4 text-[11px] text-muted-foreground pt-2 border-t border-border/20'>
          <span className='flex items-center gap-1'>
            <BookOpen className='size-3' />
            {academy.courses_count} {t('academiesLanding.card.courses')}
          </span>
          <span className='flex items-center gap-1'>
            <Users className='size-3' />
            {new Intl.NumberFormat('es').format(academy.enrolled_users_count)}
          </span>
        </div>

        <Link to='/sign-in'>
          <button className='mt-1 w-full h-8 flex items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors'>
            {t('academiesLanding.card.viewAcademy')}
          </button>
        </Link>
      </div>
    </article>
  )
}
