import { Link, useParams } from '@tanstack/react-router'
import { LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useDashboardPath } from '@/hooks/use-dashboard-path'
import { Button } from '@/components/ui/button'
import { LargeLogo } from '@/components/large-logo'

export function PageHeader() {
  const { isAuthenticated, currentAcademy } = useAuthStore()
  const dashboardPath = useDashboardPath()
  const { slug } = useParams({ strict: false })

  const myAcademySlug = slug ?? currentAcademy?.slug

  const navLinks = [
    { href: '/courses', label: 'Cursos' },
    { href: '/academies', label: 'Academias' },
    ...(isAuthenticated && myAcademySlug
      ? [{ href: `/academies/${myAcademySlug}`, label: 'Tu Academia' }]
      : [{ href: '/create-academy-landing', label: 'Crea tu Academia' }]),
  ]

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='container flex h-16 items-center justify-between gap-4'>
        {/* Left — logo */}
        <Link to='/'>
          <LargeLogo className='h-7 w-auto dark:invert' />
        </Link>

        {/* Centre — navigation links */}
        <nav className='hidden items-center gap-1 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                isAuthenticated &&
                  myAcademySlug &&
                  link.href === `/academies/${myAcademySlug}`
                  ? 'text-primary hover:text-primary/80 hover:bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — auth CTA */}
        <div className='flex shrink-0 items-center gap-2'>
          {isAuthenticated && dashboardPath ? (
            <Link to={dashboardPath}>
              <Button size='sm' className='text-sm'>
                <LayoutDashboard className='mr-1.5 size-4' />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Button variant='ghost' size='sm' asChild>
                <Link to='/sign-in'>Iniciar Sesión</Link>
              </Button>
              <Button size='sm' asChild>
                <Link to='/sign-up'>Registrarse</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
