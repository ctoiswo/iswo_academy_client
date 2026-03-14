import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function CoursesViewAll() {
  const { t } = useTranslation()
  return (
    <div className='flex justify-center'>
      <Link
        to='/courses'
        className='text-primary hover:text-primary/80 group/link flex items-center gap-2 text-sm font-medium transition-colors'
      >
        {t('pages.home.courses.viewAll')}
        <ArrowRight className='size-4 transition-transform group-hover/link:translate-x-0.5' />
      </Link>
    </div>
  )
}
