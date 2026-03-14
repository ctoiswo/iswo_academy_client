import { Link } from '@tanstack/react-router'
import { GraduationCap, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'
import { useDashboardPath } from '@/hooks/use-dashboard-path'

export function PageFooter() {
  const { isAuthenticated } = useAuthStore()
  const dashboardPath = useDashboardPath()

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
            {isAuthenticated && dashboardPath ? (
              <Button size='sm' asChild>
                <Link to={dashboardPath}>
                  <LayoutDashboard className='mr-2 h-4 w-4' />
                  Ir al Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button size='sm' variant='ghost' asChild>
                  <Link to='/sign-in'>Iniciar Sesión</Link>
                </Button>
                <Button size='sm' asChild>
                  <Link to='/sign-up'>Registrarse</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
