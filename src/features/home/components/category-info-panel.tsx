import { Link } from '@tanstack/react-router'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { CategoryWithVisual } from '@/constants/home-constants'

interface CategoryInfoPanelProps {
  category: CategoryWithVisual
  Icon: LucideIcon
}

export function CategoryInfoPanel({ category, Icon }: CategoryInfoPanelProps) {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col justify-center gap-5 p-8 lg:w-[340px] lg:shrink-0'>
      <div className='flex items-center gap-3'>
        <div
          className={cn(
            'flex size-11 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg',
            category.accentFrom,
            category.accentTo
          )}
        >
          <Icon className='size-5 text-white drop-shadow' />
        </div>
        <div className='flex flex-col'>
          <span
            className='text-foreground text-xl leading-tight font-bold'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {category.name}
          </span>
          <span className='text-muted-foreground text-xs'>
            {t('pages.home.academies.countLabel', {
              count: category.academies.length,
            })}
          </span>
        </div>
      </div>
      <p className='text-foreground/90 text-sm font-semibold'>
        {category.tagline}
      </p>
      <p className='text-muted-foreground text-xs leading-relaxed'>
        {category.description}
      </p>
      <Link
        to='/academies'
        className='text-primary hover:text-primary/80 group/link flex w-fit items-center gap-1.5 text-sm font-medium transition-colors'
      >
        {t('pages.home.academies.viewAll')}
        <ArrowRight className='size-3.5 transition-transform group-hover/link:translate-x-0.5' />
      </Link>
    </div>
  )
}
