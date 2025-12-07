import { Link, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useTranslation } from '@/hooks/use-translation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LanguageToggle } from '@/components/language-toggle'
import { LargeLogo } from '@/components/large-logo'
import { ThemeSwitch } from '@/components/theme-switch'

interface PublicHeaderProps {
  showBackButton?: boolean
  backButtonText?: string
  backButtonHref?: string
}

export function PublicHeader({
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
          <UserMenu />
          <ThemeSwitch />
          <LanguageToggle />
        </div>
      </div>
    </header>
  )
}

/**
 * UserMenu component - Shows login/register buttons or user avatar
 */
function UserMenu() {
  const { t } = useTranslation()
  const { isAuthenticated, user, logout, academyData, currentAcademy } =
    useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  const handleDashboardClick = () => {
    // Si hay una academia actual, ir a su dashboard
    if (currentAcademy?.slug) {
      navigate({
        to: '/academy/$academySlug/dashboard',
        params: { academySlug: currentAcademy.slug },
      })
    }
    // Si no hay academia actual pero tiene academias, ir a la primera
    else if (academyData?.academies && academyData.academies.length > 0) {
      const firstAcademy = academyData.academies[0]
      navigate({
        to: '/academy/$academySlug/dashboard',
        params: { academySlug: firstAcademy.slug },
      })
    }
    // Si no tiene academias, ir a la selección de academias
    else {
      navigate({ to: '/academy-selection' })
    }
  }

  // Show user avatar and menu when authenticated
  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-10 w-10 rounded-full'>
            <Avatar className='h-10 w-10'>
              <AvatarImage
                src={user.avatar_url || undefined}
                alt={user.full_name}
              />
              <AvatarFallback className='bg-primary text-primary-foreground'>
                {user.initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {user.full_name}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDashboardClick}
            className='cursor-pointer'
          >
            <LayoutDashboard className='mr-2 h-4 w-4' />
            {t('navigation.dashboard')}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings' className='cursor-pointer'>
              <Settings className='mr-2 h-4 w-4' />
              {t('navigation.settings')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
            <LogOut className='mr-2 h-4 w-4' />
            {t('navigation.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Show login/register buttons when not authenticated
  return (
    <>
      <Button variant='ghost' asChild>
        <Link to='/sign-in'>{t('navigation.login')}</Link>
      </Button>
      <Button asChild>
        <Link to='/sign-up'>{t('navigation.register')}</Link>
      </Button>
    </>
  )
}
