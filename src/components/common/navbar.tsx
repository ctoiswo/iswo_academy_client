import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { GraduationCap, Menu, X } from 'lucide-react'
import { LanguageToggle } from '@/components/language-toggle'

export function Navbar() {
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { href: '/',                       label: t('navigation.home') },
    { href: '/courses',                label: t('navigation.courses') },
    { href: '/academies',              label: t('navigation.exploreAcademies') },
    { href: '/create-academy-landing', label: t('navigation.createAcademy') },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-[0_2px_24px_rgba(0,0,0,0.3)]'
          : 'bg-transparent'
      )}
    >
      <nav className='max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 h-16'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2.5 group'>
          <div className='flex items-center justify-center size-9 rounded-xl bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors'>
            <GraduationCap className='size-5 text-primary' />
          </div>
          <span className='text-lg font-bold text-foreground tracking-tight' style={{ fontFamily: 'var(--font-heading)' }}>
            ISWO<span className='text-primary'>Academy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className='hidden md:flex items-center gap-1'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'px-3.5 py-2 text-sm font-medium rounded-lg transition-colors',
                link.href === '/create-academy-landing'
                  ? 'text-primary hover:text-primary/80 hover:bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA buttons */}
        <div className='hidden md:flex items-center gap-2'>
          <LanguageToggle />
          <Link to='/sign-in'>
            <Button variant='ghost' size='sm' className='text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_16px_rgba(99,102,241,0.2)]'>
              {t('navigation.login')}
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className='md:hidden flex items-center justify-center size-9 rounded-lg border border-border/60 bg-card text-foreground'
          aria-label='Menu'
        >
          {mobileOpen ? <X className='size-4' /> : <Menu className='size-4' />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300 bg-background/95 backdrop-blur-xl border-b border-border/40',
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 border-none'
        )}
      >
        <div className='flex flex-col gap-1 px-4 py-4'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className='px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg transition-colors'
            >
              {link.label}
            </Link>
          ))}
          <div className='flex items-center justify-between pt-3 mt-2 border-t border-border/40'>
            <LanguageToggle variant='outline' size='sm' />
            <Link to='/sign-in'>
              <Button variant='ghost' className='text-sm'>{t('navigation.login')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
