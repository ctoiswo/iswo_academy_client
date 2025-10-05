import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { useAuthStore, type LoginCredentials } from '@/stores/auth-store'
import { getErrorMessage, isApiError } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Por favor ingresa tu correo electrónico')
    .email('Por favor ingresa una dirección de correo electrónico válida'),
  password: z
    .string()
    .min(1, 'Por favor ingresa tu contraseña')
    .min(7, 'La contraseña debe tener al menos 7 caracteres'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login, error, setError } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      setError(null) // Clear any previous errors

      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      }

      await login(credentials)

      // Show success message
      toast.success(`¡Bienvenido de vuelta, ${data.email}!`)

      // Redirect to the stored location or default to academies
      const targetPath = redirectTo || '/academies'
      navigate({ to: targetPath, replace: true })
    } catch (error: any) {
      console.error('Login error:', error)

      let errorMessage = 'Error al iniciar sesión. Por favor intenta de nuevo.'

      if (isApiError(error)) {
        switch (error.code) {
          case 'INVALID_CREDENTIALS':
            errorMessage =
              'Correo electrónico o contraseña incorrectos. Por favor verifica tus credenciales e intenta de nuevo.'
            break
          case 'ACCOUNT_NOT_CONFIRMED':
            errorMessage =
              'Por favor revisa tu correo electrónico y confirma tu cuenta antes de iniciar sesión.'
            break
          case 'ACCOUNT_LOCKED':
            errorMessage =
              'Tu cuenta ha sido bloqueada. Por favor contacta a soporte.'
            break
          case 'VALIDATION_ERROR':
            errorMessage = getErrorMessage(error)
            break
          case 'RATE_LIMIT_EXCEEDED':
            errorMessage =
              'Demasiados intentos de inicio de sesión. Por favor intenta más tarde.'
            break
          case 'NETWORK_ERROR':
            errorMessage =
              'Falló la conexión de red. Por favor verifica tu conexión a internet.'
            break
          default:
            errorMessage = getErrorMessage(error)
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      toast.error(errorMessage)

      // Set specific field errors if validation failed
      if (
        isApiError(error) &&
        error.code === 'VALIDATION_ERROR' &&
        error.details
      ) {
        error.details.forEach((detail: string) => {
          if (detail.toLowerCase().includes('email')) {
            form.setError('email', { message: detail })
          } else if (detail.toLowerCase().includes('password')) {
            form.setError('password', { message: detail })
          }
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        {error && (
          <div className='bg-destructive/15 text-destructive rounded-md p-3 text-sm'>
            {error}
          </div>
        )}

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder='nombre@ejemplo.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Iniciar sesión
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              O continúa con
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
