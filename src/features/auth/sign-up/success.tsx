import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'

export function SignUpSuccess() {
  return (
    <AuthLayout showAuthNavigation={false}>
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight text-green-600'>
            ¡Registro Exitoso!
          </CardTitle>
          <CardDescription>
            Tu cuenta ha sido creada exitosamente. <br />
            Por favor revisa tu correo electrónico para confirmar tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button asChild className='w-full'>
            <Link to='/sign-in'>Ir a Iniciar Sesión</Link>
          </Button>
          <Button asChild variant='outline' className='w-full'>
            <Link to='/sign-up'>Registrar Otra Cuenta</Link>
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
