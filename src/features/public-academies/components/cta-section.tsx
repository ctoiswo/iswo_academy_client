import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function CTASection() {
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={headerVariants}
      initial='hidden'
      animate='visible'
      className='mt-20 rounded-3xl border bg-slate-100 py-16 text-center dark:bg-slate-800'
    >
      <h2 className='text-foreground mb-4 text-3xl font-bold'>
        ¿No encuentras lo que buscas?
      </h2>
      <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-xl'>
        Crea tu propia academia y comparte tu conocimiento con miles de
        estudiantes.
      </p>
      <Button size='lg' variant='default' className='px-8'>
        Crear Mi Academia
      </Button>
    </motion.div>
  )
}
