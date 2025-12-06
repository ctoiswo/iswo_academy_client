import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { useAuthStore, type LoginCredentials } from '@/stores/auth-store'
import { isApiError } from '@/lib/api-client'
import {
  getErrorMessage,
  getValidationDetails,
  isValidationError,
  shouldLogout,
} from '@/lib/error-handler'
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
  const { login, logout, error, setError } = useAuthStore()

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

      const result = await login(credentials)

      // Show success message
      toast.success(`¡Bienvenido de vuelta, ${data.email}!`)

      // Redirect based on login result
      if (result.shouldRedirect && result.redirectPath) {
        navigate({ to: result.redirectPath, replace: true })
      } else {
        // Fallback to redirectTo prop or academies if no path specified
        const targetPath = redirectTo || '/academies'
        navigate({ to: targetPath, replace: true })
      }
    } catch (error: unknown) {
      console.error('Login error:', error)

      // Usar el error handler centralizado
      const errorMessage = getErrorMessage(error)

      toast.error(errorMessage)
      setError(errorMessage)

      // Si es error de validación, asignar mensajes a campos específicos
      if (isApiError(error) && isValidationError(error)) {
        const validationDetails = getValidationDetails(error)

        // Asignar errores a los campos correspondientes
        Object.entries(validationDetails).forEach(([field, message]) => {
          if (field === 'email' || field === 'password') {
            form.setError(field, { message })
          }
        })
      }

      // Si el error requiere logout, cerrar sesión
      if (shouldLogout(error)) {
        logout()
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
              <FormLabel className='text-black'>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  className='text-black'
                  placeholder='nombre@ejemplo.com'
                  {...field}
                />
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
              <FormLabel className='text-black'>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput
                  className='text-black'
                  placeholder='********'
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 end-0 text-sm font-medium hover:opacity-75'
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
            <span className='px-2 text-black'>O continúa con</span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='default'
            type='button'
            disabled={isLoading}
            className='bg-background text-white'
          >
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='default'
            type='button'
            disabled={isLoading}
            className='bg-background text-white'
          >
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
