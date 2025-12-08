import { motion } from 'framer-motion'
import { Header } from '@/features/home/components/header'

export function LoadingSpinner() {
  return (
    <div className='bg-background min-h-screen'>
      <Header />
      <div className='container mx-auto px-4 py-8'>
        <div className='flex min-h-[400px] flex-col items-center justify-center'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='border-primary h-8 w-8 rounded-full border-4 border-t-transparent'
          />
          <p className='text-muted-foreground mt-4'>Cargando academia...</p>
        </div>
      </div>
    </div>
  )
}
