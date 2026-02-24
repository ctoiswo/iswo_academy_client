import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'

export function CoursesViewAll() {
  const { t } = useTranslation()
  return (
    <div className='flex justify-center'>
      <Link
        to='/courses'
        className='flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link'
      >
        {t('pages.home.courses.viewAll')}
        <ArrowRight className='size-4 group-hover/link:translate-x-0.5 transition-transform' />
      </Link>
    </div>
  )
}
