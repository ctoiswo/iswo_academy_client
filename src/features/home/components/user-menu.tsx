import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, LogOut, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { useDashboardPath } from '@/hooks/use-dashboard-path'
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

export function UserMenu() {
  const { t } = useTranslation()
  const { isAuthenticated, user, logout } = useAuthStore()
  const dashboardPath = useDashboardPath()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  const handleDashboardClick = () => {
    navigate({ to: (dashboardPath || '/academy-selection') as string })
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
