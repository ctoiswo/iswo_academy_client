import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight, type LucideIcon } from 'lucide-react'
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
            'flex items-center justify-center size-11 rounded-xl bg-gradient-to-br shadow-lg',
            category.accentFrom,
            category.accentTo
          )}
        >
          <Icon className='size-5 text-white drop-shadow' />
        </div>
        <div className='flex flex-col'>
          <span
            className='text-xl font-bold text-foreground leading-tight'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {category.name}
          </span>
          <span className='text-xs text-muted-foreground'>
            {t('pages.home.academies.countLabel', { count: category.academies.length })}
          </span>
        </div>
      </div>
      <p className='text-sm font-semibold text-foreground/90'>{category.tagline}</p>
      <p className='text-xs text-muted-foreground leading-relaxed'>{category.description}</p>
      <Link
        to='/academies'
        className='flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-fit group/link'
      >
        {t('pages.home.academies.viewAll')}
        <ArrowRight className='size-3.5 group-hover/link:translate-x-0.5 transition-transform' />
      </Link>
    </div>
  )
}
