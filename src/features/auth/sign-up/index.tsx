import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnimatedAuthLayout } from '../components/animated-auth-layout'
import { AnimatedSignUpForm } from './components/animated-sign-up-form'

export function SignUp() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  }

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const footerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <AnimatedAuthLayout 
      title="Comienza tu viaje de aprendizaje"
      subtitle="Únete a miles de estudiantes y educadores que ya forman parte de nuestra comunidad"
    >
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        <Card className='gap-4 shadow-xl border-0 bg-white/95 backdrop-blur-sm'>
          <motion.div variants={headerVariants}>
            <CardHeader className='pb-4'>
              <CardTitle className='text-2xl font-bold tracking-tight text-gray-900'>
                Crear una cuenta
              </CardTitle>
              <CardDescription className='text-gray-600'>
                Ingresa tu información personal para comenzar tu experiencia de aprendizaje.
              </CardDescription>
            </CardHeader>
          </motion.div>

          <motion.div variants={contentVariants}>
            <CardContent>
              <AnimatedSignUpForm />
            </CardContent>
          </motion.div>

          <motion.div variants={footerVariants}>
            <CardFooter className="flex flex-col gap-4">
              <p className='text-muted-foreground px-2 text-center text-sm leading-relaxed'>
                Al crear una cuenta, aceptas nuestros{' '}
                <motion.a
                  href='/terms'
                  className='hover:text-primary underline underline-offset-4 font-medium transition-colors'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Términos de Servicio
                </motion.a>{' '}
                y{' '}
                <motion.a
                  href='/privacy'
                  className='hover:text-primary underline underline-offset-4 font-medium transition-colors'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Política de Privacidad
                </motion.a>
                .
              </p>
              
              <div className="w-full border-t border-gray-100"></div>
              
              <p className='text-center text-sm text-muted-foreground'>
                ¿Ya tienes una cuenta?{' '}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to='/sign-in'
                    className='font-medium text-secondary hover:text-secondary/80 underline underline-offset-4 transition-colors'
                  >
                    Inicia sesión
                  </Link>
                </motion.span>
              </p>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatedAuthLayout>
  )
}
