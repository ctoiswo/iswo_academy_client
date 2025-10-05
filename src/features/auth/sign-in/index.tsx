import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Iniciar sesión
          </CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y contraseña <br />
            para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground px-8 text-center text-sm'>
            Al hacer clic en iniciar sesión, aceptas nuestros{' '}
            <a
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Política de Privacidad
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
