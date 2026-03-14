import { Link } from '@tanstack/react-router'
import { ArrowRight, Play } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function HeroCtas() {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center gap-4 sm:flex-row'>
      <Link to='/courses'>
        <Button
          size='lg'
          className='bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-sm font-semibold shadow-[0_0_24px_rgba(99,102,241,0.25)] transition-all duration-300 hover:shadow-[0_0_32px_rgba(99,102,241,0.35)]'
        >
          {t('pages.home.hero.exploreCourses')}
          <ArrowRight className='ml-2 size-4' />
        </Button>
      </Link>
      <Link to='/create-academy-landing'>
        <Button
          variant='outline'
          size='lg'
          className='border-border/60 text-foreground hover:bg-secondary/40 hover:border-primary/40 h-12 px-8 text-sm font-semibold transition-all duration-300'
        >
          <Play className='text-primary mr-2 size-4' />
          {t('pages.home.hero.createAcademy')}
        </Button>
      </Link>
    </div>
  )
}
