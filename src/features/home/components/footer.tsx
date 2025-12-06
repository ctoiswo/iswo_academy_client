/**
 * Footer Component
 * Simple footer with branding and auth links
 */
import { Link } from '@tanstack/react-router'
import { GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  return (
    <footer className='bg-muted/50 border-t'>
      <div className='container py-8'>
        <div className='flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0'>
          <div className='flex items-center space-x-2'>
            <GraduationCap className='text-primary h-6 w-6' />
            <span className='font-bold'>ISWO Academy</span>
          </div>
          <p className='text-muted-foreground text-sm'>
            © 2025 ISWO Academy. Todos los derechos reservados.
          </p>
          <div className='flex items-center space-x-4'>
            <Button size='sm' variant='ghost' asChild>
              <Link to='/sign-in'>Iniciar Sesión</Link>
            </Button>
            <Button size='sm' asChild>
              <Link to='/sign-up'>Registrarse</Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
