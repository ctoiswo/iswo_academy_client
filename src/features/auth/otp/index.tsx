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
import { OtpForm } from './components/otp-form'

export function Otp() {
  return (
    <AnimatedAuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-base tracking-tight'>
            Autenticación de dos factores
          </CardTitle>
          <CardDescription>
            Por favor ingresa el código de autenticación. <br /> Hemos enviado
            el código de autenticación a tu correo electrónico.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OtpForm />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            ¿No lo has recibido?{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              Reenviar un nuevo código.
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AnimatedAuthLayout>
  )
}
