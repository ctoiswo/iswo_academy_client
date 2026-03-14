import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Menu, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useDashboardPath } from '@/hooks/use-dashboard-path'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/language-toggle'
import { LargeLogo } from '@/components/large-logo'

export function Navbar() {
  const { t } = useTranslation()
  const { isAuthenticated, currentAcademy } = useAuthStore()
  const dashboardPath = useDashboardPath()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const myAcademySlug = currentAcademy?.slug

  const navLinks = [
    { href: '/', label: t('navigation.home') },
    { href: '/courses', label: t('navigation.courses') },
    { href: '/academies', label: t('navigation.exploreAcademies') },
    ...(isAuthenticated && myAcademySlug
      ? [{ href: `/academies/${myAcademySlug}`, label: 'Tu Academia' }]
      : [
          {
            href: '/create-academy-landing',
            label: t('navigation.createAcademy'),
          },
        ]),
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 border-border/40 border-b shadow-[0_2px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8'>
        {/* Logo */}
        <Link to='/' className='flex items-center'>
          <LargeLogo className='h-7 w-auto dark:invert' />
        </Link>

        {/* Desktop Nav */}
        <div className='hidden items-center gap-1 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                link.href === '/create-academy-landing' ||
                  (isAuthenticated &&
                    myAcademySlug &&
                    link.href === `/academies/${myAcademySlug}`)
                  ? 'text-primary hover:text-primary/80 hover:bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className='hidden items-center gap-2 md:flex'>
          <LanguageToggle />
          {isAuthenticated && dashboardPath ? (
            <Link to={dashboardPath}>
              <Button
                size='sm'
                className='bg-primary text-primary-foreground hover:bg-primary/90 text-sm shadow-[0_0_16px_rgba(99,102,241,0.2)]'
              >
                <LayoutDashboard className='mr-1.5 size-4' />
                {t('navigation.dashboard')}
              </Button>
            </Link>
          ) : (
            <>
              <Link to='/sign-in'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='bg-primary text-primary-foreground hover:bg-primary/90 text-sm shadow-[0_0_16px_rgba(99,102,241,0.2)]'
                >
                  {t('navigation.login')}
                </Button>
              </Link>
              <Link to='/sign-up'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='bg-primary text-primary-foreground hover:bg-primary/90 text-sm shadow-[0_0_16px_rgba(99,102,241,0.2)]'
                >
                  {t('navigation.register')}
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className='border-border/60 bg-card text-foreground flex size-9 items-center justify-center rounded-lg border md:hidden'
          aria-label='Menu'
        >
          {mobileOpen ? <X className='size-4' /> : <Menu className='size-4' />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'bg-background/95 border-border/40 overflow-hidden border-b backdrop-blur-xl transition-all duration-300 md:hidden',
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 border-none opacity-0'
        )}
      >
        <div className='flex flex-col gap-1 px-4 py-4'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className='text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'
            >
              {link.label}
            </Link>
          ))}

          <div className='border-border/40 mt-2 flex items-center justify-between border-t pt-3'>
            <LanguageToggle variant='outline' size='sm' />
            {isAuthenticated && dashboardPath ? (
              <Link to={dashboardPath} onClick={() => setMobileOpen(false)}>
                <Button size='sm' className='text-sm'>
                  <LayoutDashboard className='mr-1.5 size-4' />
                  {t('navigation.dashboard')}
                </Button>
              </Link>
            ) : (
              <Link to='/sign-in' onClick={() => setMobileOpen(false)}>
                <Button variant='ghost' className='text-sm'>
                  {t('navigation.login')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
