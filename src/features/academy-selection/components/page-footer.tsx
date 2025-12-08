import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PageFooter() {
  return (
    <motion.footer
      className='mt-20 text-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className='bg-muted/30 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 backdrop-blur-sm'>
        <Users className='text-muted-foreground h-4 w-4' />
        <p className='text-muted-foreground text-sm'>
          ¿Necesitas ayuda? Contacta al administrador de tu academia o{' '}
          <Button variant='link' className='h-auto p-0 text-sm font-semibold'>
            visita nuestro centro de ayuda
          </Button>
        </p>
      </div>
    </motion.footer>
  )
}
