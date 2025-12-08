import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/language-toggle'
import { LargeLogo } from '@/components/large-logo'
import { ThemeSwitch } from '@/components/theme-switch'
import { UserMenu } from './user-menu'

interface PublicHeaderProps {
  showBackButton?: boolean
  backButtonText?: string
  backButtonHref?: string
}

export function Header({
  showBackButton = false,
  backButtonText,
  backButtonHref = '/',
}: PublicHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center space-x-4'>
          {showBackButton && (
            <Button variant='ghost' size='sm' asChild>
              <Link to={backButtonHref}>
                <ArrowLeft className='mr-2 h-4 w-4' />
                {backButtonText || t('navigation.backToHome')}
              </Link>
            </Button>
          )}
        </div>

        <motion.div
          className='flex items-center space-x-2'
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Link to='/' className='flex items-center'>
            <LargeLogo />
          </Link>
        </motion.div>

        <nav className='hidden items-center space-x-6 md:flex'>
          <Link
            to='/academies'
            className='hover:text-primary text-sm font-medium transition-colors'
          >
            {t('navigation.exploreAcademies')}
          </Link>
          <Link
            to='/landing'
            className='text-primary hover:text-primary/80 text-sm font-medium transition-colors'
          >
            {t('navigation.createAcademy')}
          </Link>
        </nav>

        <div className='flex items-center space-x-4'>
          <ThemeSwitch />
          <LanguageToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
