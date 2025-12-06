import { Link, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LargeLogo } from '@/components/large-logo'

export function PageHeader() {
  const router = useRouter()

  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
      <div className='container flex h-16 items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => router.history.back()}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver
          </Button>
        </div>

        <motion.div
          className='flex items-center space-x-2'
          whileHover={{ scale: 1.05 }}
        >
          <LargeLogo />
        </motion.div>

        <div className='flex items-center space-x-4'>
          <Button variant='ghost' asChild>
            <Link to='/sign-in'>Iniciar Sesión</Link>
          </Button>
          <Button asChild>
            <Link to='/sign-up'>Registrarse</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
