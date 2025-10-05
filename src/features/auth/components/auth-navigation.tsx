import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function AuthNavigation() {
  const location = useLocation()
  const currentPath = location.pathname

  // Don't show navigation on success pages
  if (currentPath.includes('success')) {
    return null
  }

  return (
    <div className='mb-6 flex items-center justify-center space-x-1'>
      <Button
        variant={currentPath === '/sign-in' ? 'default' : 'ghost'}
        size='sm'
        asChild
        className={cn(
          'text-sm',
          currentPath === '/sign-in' && 'pointer-events-none'
        )}
      >
        <Link to='/sign-in'>Iniciar Sesión</Link>
      </Button>
      <span className='text-muted-foreground mx-2 text-sm'>•</span>
      <Button
        variant={currentPath === '/sign-up' ? 'default' : 'ghost'}
        size='sm'
        asChild
        className={cn(
          'text-sm',
          currentPath === '/sign-up' && 'pointer-events-none'
        )}
      >
        <Link to='/sign-up'>Registrarse</Link>
      </Button>
    </div>
  )
}
