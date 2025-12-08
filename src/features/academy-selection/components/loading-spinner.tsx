import { motion } from 'framer-motion'

export function LoadingSpinner() {
  return (
    <div className='from-background via-background to-primary/5 flex min-h-screen items-center justify-center bg-gradient-to-br'>
      <motion.div
        className='text-center'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className='border-primary mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-t-transparent'
          role='status'
          aria-label='Loading'
        ></div>
        <p className='text-muted-foreground text-lg'>
          Cargando tus academias...
        </p>
      </motion.div>
    </div>
  )
}
