import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play } from 'lucide-react'

export function HeroCtas() {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col sm:flex-row items-center gap-4'>
      <Link to='/courses'>
        <Button
          size='lg'
          className='h-12 px-8 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_rgba(99,102,241,0.25)] hover:shadow-[0_0_32px_rgba(99,102,241,0.35)] transition-all duration-300'
        >
          {t('pages.home.hero.exploreCourses')}
          <ArrowRight className='size-4 ml-2' />
        </Button>
      </Link>
      <Link to='/create-academy-landing'>
        <Button
          variant='outline'
          size='lg'
          className='h-12 px-8 text-sm font-semibold border-border/60 text-foreground hover:bg-secondary/40 hover:border-primary/40 transition-all duration-300'
        >
          <Play className='size-4 mr-2 text-primary' />
          {t('pages.home.hero.createAcademy')}
        </Button>
      </Link>
    </div>
  )
}
