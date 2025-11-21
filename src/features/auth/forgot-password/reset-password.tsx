import { Link, useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { ResetPasswordForm } from './components/reset-password-form'

export function ResetPassword() {
  const search = useSearch({ from: '/(auth)/reset-password' })
  const token = search.token as string

  if (!token) {
    return (
      <AuthLayout>
        <Card className='gap-4'>
          <CardHeader>
            <CardTitle className='text-lg tracking-tight text-destructive'>
              Enlace de Restablecimiento Inválido
            </CardTitle>
            <CardDescription>
              El enlace de restablecimiento de contraseña es inválido o falta. Por favor solicita un nuevo restablecimiento de contraseña.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="w-full text-center">
              <Link
                to='/forgot-password'
                className='hover:text-primary underline underline-offset-4'
              >
                Solicitar nuevo restablecimiento
              </Link>
            </div>
          </CardFooter>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            Restablecer tu Contraseña
          </CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña a continuación. Asegúrate de que sea fuerte y segura.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} />
        </CardContent>
        <CardFooter>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
            ¿Recuerdas tu contraseña?{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              Iniciar sesión
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}