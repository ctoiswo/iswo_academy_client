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
      <div className='mb-5 flex items-center justify-center gap-3'>
        <div className='bg-primary/10 border-primary/20 flex size-14 items-center justify-center rounded-xl border'>
          <GraduationCap className='text-primary size-7' />
        </div>
      </div>
      <h1
        className='text-foreground mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Selecciona tu{' '}
        <span className='from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent'>
          Academia
        </span>
      </h1>
      <motion.p
        className='text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Bienvenido de nuevo,{' '}
        <span className='text-foreground font-semibold'>{userName}</span>. Elige
        la academia a la que deseas acceder hoy.
      </motion.p>
    </motion.header>
  )
}
