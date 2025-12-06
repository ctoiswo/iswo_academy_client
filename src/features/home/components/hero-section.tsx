/**
 * Hero Section Component
 * Displays the main hero banner with search functionality
 */
import { motion } from 'framer-motion'
import { GlobalSearchBar } from '@/components/search/global-search-bar'

export function HeroSection() {
  return (
    <section className='relative py-20 lg:py-32'>
      <div className='absolute inset-0 z-0'>
        <img
          src='https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt='Estudiantes aprendiendo'
          className='h-full w-full object-cover opacity-10'
        />
        <div className='from-background/80 to-background/60 absolute inset-0 bg-gradient-to-br' />
      </div>

      <div className='relative z-10 container'>
        <div className='mx-auto max-w-4xl text-center'>
          <motion.h1
            className='text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Descubre tu próxima
            <span className='text-primary'> oportunidad de aprendizaje</span>
          </motion.h1>

          <motion.p
            className='text-muted-foreground mt-6 text-lg leading-8 sm:text-xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Explora miles de cursos creados por expertos en academias
            especializadas. Aprende nuevas habilidades y haz crecer tu carrera
            profesional.
          </motion.p>

          <motion.div
            className='mx-auto mt-10 flex w-full justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <GlobalSearchBar />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
