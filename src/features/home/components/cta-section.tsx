/**
 * CTA Section Component
 * Call-to-action for creators
 */
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className='bg-primary/5 border-t py-20'>
      <div className='container'>
        <motion.div
          className='mx-auto max-w-4xl text-center'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            ¿Tienes conocimiento que compartir?
          </h2>
          <p className='text-muted-foreground mt-6 text-lg leading-8'>
            Únete a miles de instructores que ya están creando sus propias
            academias en línea. Comparte tu experiencia y genera ingresos
            enseñando lo que más te apasiona.
          </p>
          <div className='mt-10'>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size='lg' asChild>
                <Link to='/landing'>
                  Crear mi Academia
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
