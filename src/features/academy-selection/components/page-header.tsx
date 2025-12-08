import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'

interface PageHeaderProps {
  userName: string
}

export function PageHeader({ userName }: PageHeaderProps) {
  return (
    <motion.header
      className='mb-16 text-center'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className='mb-6 flex items-center justify-center'>
        <div className='from-primary to-primary/80 mr-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl'>
          <GraduationCap className='h-8 w-8 text-white' />
        </div>
        <h1 className='from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl'>
          Selecciona tu Academia
        </h1>
      </div>
      <motion.p
        className='text-muted-foreground mx-auto max-w-2xl text-xl'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        ¡Bienvenido de nuevo,{' '}
        <span className='text-foreground font-semibold'>{userName}</span>! Elige
        la academia a la que deseas acceder hoy.
      </motion.p>
    </motion.header>
  )
}
