import { motion } from 'framer-motion'
import { GraduationCap, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EmptyState() {
  return (
    <motion.div
      className='py-16 text-center'
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='from-primary/20 to-primary/5 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-lg'>
        <GraduationCap className='text-primary h-12 w-12' />
      </div>
      <h3 className='mb-3 text-2xl font-bold'>No tienes academias</h3>
      <p className='text-muted-foreground mx-auto mb-8 max-w-md text-lg'>
        Aún no perteneces a ninguna academia. Crea tu propia academia o solicita
        una invitación a un administrador.
      </p>
      <div className='flex flex-col justify-center gap-4 sm:flex-row'>
        <Button size='lg' className='shadow-lg'>
          <Plus className='mr-2 h-5 w-5' />
          Crear Academia
        </Button>
        <Button variant='outline' size='lg'>
          Solicitar Invitación
        </Button>
      </div>
    </motion.div>
  )
}
