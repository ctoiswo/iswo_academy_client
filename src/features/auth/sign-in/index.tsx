import { motion } from 'framer-motion'
import { Link, useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnimatedAuthLayout } from '../components/animated-auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

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
      title="¡Bienvenido de vuelta!"
      subtitle="Continúa tu viaje de aprendizaje y descubre nuevas oportunidades en ISWO Academy"
      reversed={true}
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
                Iniciar sesión
              </CardTitle>
              <CardDescription className='text-base text-gray-600'>
                Ingresa tu correo electrónico y contraseña <br />
                para acceder a tu cuenta.
              </CardDescription>
            </CardHeader>
          </motion.div>

          <motion.div 
            variants={contentVariants}
            transition={{ delay: 0.2 }}
          >
            <CardContent>
              <UserAuthForm redirectTo={redirect} />
            </CardContent>
          </motion.div>

          <motion.div 
            variants={footerVariants}
            transition={{ delay: 0.3 }}
          >
            <CardFooter className='flex-col space-y-4'>
              <p className='text-muted-foreground text-center text-sm leading-relaxed'>
                Al hacer clic en iniciar sesión, aceptas nuestros{' '}
                <a
                  href='/terms'
                  className='hover:text-primary underline underline-offset-4 font-medium'
                >
                  Términos de Servicio
                </a>{' '}
                y{' '}
                <a
                  href='/privacy'
                  className='hover:text-primary underline underline-offset-4 font-medium'
                >
                  Política de Privacidad
                </a>
                .
              </p>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿No tienes una cuenta?{' '}
                  <Link 
                    to="/sign-up" 
                    className="font-semibold text-blue-600 hover:text-blue-500 underline underline-offset-2"
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatedAuthLayout>
  )
}
