import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DemoDialog } from './DemoDialog'

export function HeroSection() {
  return (
    <section id='hero' className='relative overflow-hidden py-20 lg:py-32'>
      {/* Background Image from Pexels */}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant='outline' className='mb-6'>
              🚀 Lanza tu Academia Hoy
            </Badge>
          </motion.div>

          <motion.h1
            className='text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Crea tu Propia
            <span className='text-primary'> Academia Online</span>
          </motion.h1>

          <motion.p
            className='text-muted-foreground mt-6 text-lg leading-8 sm:text-xl'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Construye, administra y escala tu plataforma educativa con nuestras
            herramientas integrales de creación de academias. Empodera a
            estudiantes de todo el mundo con tu experiencia.
          </motion.p>

          <motion.div
            className='mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size='lg' asChild>
                <Link to='/sign-up'>
                  Comenzar a Construir
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </motion.div>
            <DemoDialog
              trigger={
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant='outline' size='lg'>
                    <Play className='mr-2 h-4 w-4' />
                    Solicitar Demo
                  </Button>
                </motion.div>
              }
              idPrefix='hero-'
            />
          </motion.div>

          <motion.div
            className='text-muted-foreground mt-8 flex items-center justify-center space-x-6 text-sm'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className='flex items-center'>
              <Check className='mr-2 h-4 w-4 text-green-500' />
              Gratis para comenzar
            </div>
            <div className='flex items-center'>
              <Check className='mr-2 h-4 w-4 text-green-500' />
              Sin tarifas de configuración
            </div>
            <div className='flex items-center'>
              <Check className='mr-2 h-4 w-4 text-green-500' />
              Cancela cuando quieras
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
