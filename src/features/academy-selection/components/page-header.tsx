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
        <div className='flex items-center justify-center size-14 rounded-xl bg-primary/10 border border-primary/20'>
          <GraduationCap className='size-7 text-primary' />
        </div>
      </div>
      <h1
        className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4'
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Selecciona tu{' '}
        <span className='bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent'>
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
