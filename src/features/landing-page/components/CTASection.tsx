import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Mail, Phone, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function CTASection() {
  return (
    <section id='cta' className='relative overflow-hidden py-20'>
      {/* Background Image from Pexels */}
      <div className='absolute inset-0 z-0'>
        <img
          src='https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt='Equipo trabajando juntos'
          className='h-full w-full object-cover opacity-10'
        />
        <div className='from-background/80 to-background/60 absolute inset-0 bg-gradient-to-br' />
      </div>

      <div className='relative z-10 container'>
        <motion.div
          className='mx-auto max-w-2xl text-center'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            ¿Listo para construir tu academia?
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            Únete a miles de educadores que ya están creando experiencias de
            aprendizaje increíbles
          </p>

          <motion.div
            className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size='lg' asChild>
                <Link to='/sign-up'>
                  Inicia tu Academia Gratuita
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant='outline' size='lg' asChild>
                <Link to='/sign-in'>Iniciar Sesión</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className='mt-6'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='link' className='text-muted-foreground'>
                  ¿Necesitas ayuda para comenzar? Contacta a nuestro equipo
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Contacta a Nuestro Equipo</DialogTitle>
                  <DialogDescription>
                    ¿Tienes preguntas? Nuestro equipo está aquí para ayudarte a
                    comenzar con tu academia.
                  </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                    <Mail className='text-primary h-5 w-5' />
                    <div>
                      <p className='font-medium'>Soporte por Email</p>
                      <p className='text-muted-foreground text-sm'>
                        support@iswoacademy.com
                      </p>
                    </div>
                  </div>
                  <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                    <Phone className='text-primary h-5 w-5' />
                    <div>
                      <p className='font-medium'>Soporte Telefónico</p>
                      <p className='text-muted-foreground text-sm'>
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                  <div className='bg-muted/50 flex items-center space-x-3 rounded-lg p-3'>
                    <Building className='text-primary h-5 w-5' />
                    <div>
                      <p className='font-medium'>Horario de Atención</p>
                      <p className='text-muted-foreground text-sm'>
                        Lun-Vie, 9AM-6PM EST
                      </p>
                    </div>
                  </div>
                  <div className='pt-4'>
                    <Button asChild className='w-full'>
                      <Link to='/sign-up'>
                        Comenzar Ahora
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
