import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/assets/logo'
import { Button } from '@/components/ui/button'
import { AuthNavigation } from './components/auth-navigation'

type AuthLayoutProps = {
  children: React.ReactNode
  showBackButton?: boolean
  showAuthNavigation?: boolean
}

export function AuthLayout({
  children,
  showBackButton = true,
  showAuthNavigation = true,
}: AuthLayoutProps) {
  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        {/* Header with logo and back button */}
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center'>
            <Link
              to='/'
              className='flex items-center transition-opacity hover:opacity-75'
            >
              <Logo className='me-2' />
              <h1 className='text-xl font-medium'>Shadcn Admin</h1>
            </Link>
          </div>
          {showBackButton && (
            <Button variant='ghost' size='sm' asChild>
              <Link to='/'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Volver al inicio
              </Link>
            </Button>
          )}
        </div>

        {/* Auth navigation tabs */}
        {showAuthNavigation && <AuthNavigation />}

        {children}
      </div>
    </div>
  )
}
