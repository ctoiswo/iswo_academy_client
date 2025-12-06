import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LargeLogo } from '@/components/large-logo'

interface NavigationProps {
  onSectionClick: (sectionId: string) => void
}

export function Navigation({ onSectionClick }: NavigationProps) {
  return (
    <motion.nav
      className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='container flex h-16 items-center justify-between'>
        <motion.div
          className='flex items-center space-x-2'
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <LargeLogo />
        </motion.div>
        <div className='hidden items-center space-x-6 md:flex'>
          <Link
            to='/'
            className='hover:text-primary text-sm font-medium transition-colors'
          >
            Explorar Cursos
          </Link>
          <button
            onClick={() => onSectionClick('features')}
            className='hover:text-primary text-sm font-medium transition-colors'
          >
            Características
          </button>
          <button
            onClick={() => onSectionClick('pricing')}
            className='hover:text-primary text-sm font-medium transition-colors'
          >
            Precios
          </button>
          <button
            onClick={() => onSectionClick('testimonials')}
            className='hover:text-primary text-sm font-medium transition-colors'
          >
            Testimonios
          </button>
        </div>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' asChild>
            <Link to='/sign-in'>Iniciar Sesión</Link>
          </Button>
          <Button asChild>
            <Link to='/sign-up'>Comenzar</Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  )
}
