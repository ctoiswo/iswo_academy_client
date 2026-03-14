import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/language-toggle'
import { LargeLogo } from '@/components/large-logo'
import { UserMenu } from './user-menu'

export function Header() {
  const { t } = useTranslation()

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='container flex h-16 items-center justify-between'>
        <motion.div className='flex items-center space-x-2'>
          <Link to='/'>
            <LargeLogo />
          </Link>
        </motion.div>
        <nav className='flex items-center gap-2'>
          <Button variant='ghost' size='sm' asChild>
            <Link to='/'>
              <ArrowLeft className='me-1 size-4' />
              {t('navigation.backToHome')}
            </Link>
          </Button>
          <Button variant='ghost' size='sm' asChild>
            <Link to='/academies'>{t('navigation.exploreAcademies')}</Link>
          </Button>
          <Button variant='ghost' size='sm' asChild>
            <Link to='/create-academy-landing'>{t('navigation.createAcademy')}</Link>
          </Button>
          <LanguageToggle />
          <UserMenu />
        </nav>
      </div>
    </header>
  )
}
