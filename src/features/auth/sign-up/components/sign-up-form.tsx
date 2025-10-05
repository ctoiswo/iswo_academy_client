import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { useAuthStore } from '@/stores/auth-store'
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

// Zod schema matching Rails validations
const formSchema = z
  .object({
    first_name: z
      .string()
      .min(1, 'El nombre es obligatorio')
      .max(50, 'El nombre debe tener menos de 50 caracteres'),
    last_name: z
      .string()
      .min(1, 'El apellido es obligatorio')
      .max(50, 'El apellido debe tener menos de 50 caracteres'),
    email: z
      .string()
      .min(1, 'El correo electrónico es obligatorio')
      .email('Por favor ingresa una dirección de correo electrónico válida')
      .max(255, 'El correo electrónico debe tener menos de 255 caracteres'),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(128, 'La contraseña debe tener menos de 128 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
      ),
    password_confirmation: z
      .string()
      .min(1, 'Por favor confirma tu contraseña'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      await register(data)

      // Show success toast
      toast.success('¡Cuenta creada exitosamente!', {
        description:
          'Por favor revisa tu correo electrónico para confirmar tu cuenta.',
      })

      // Reset form and redirect to success page
      form.reset()
      navigate({ to: '/sign-up-success' })
    } catch (error: any) {
      console.error('Registration error:', error)

      // Handle different types of errors
      if (isApiError(error)) {
        // Handle validation errors
        if (error.type === 'ValidationError' && error.details) {
          // Set field-specific errors if available
          error.details.forEach((detail: string) => {
            // Translate common validation messages to Spanish
            let translatedDetail = detail
            if (detail.includes('Email has already been taken')) {
              translatedDetail = 'Este correo electrónico ya está registrado'
              toast.error('Error en el registro', {
                description: translatedDetail,
              })
            } else if (detail.includes('Email')) {
              translatedDetail = detail.replace('Email', 'Correo electrónico')
            } else if (detail.includes('Password')) {
              translatedDetail = detail.replace('Password', 'Contraseña')
            } else if (detail.includes('First name')) {
              translatedDetail = detail.replace('First name', 'Nombre')
            } else if (detail.includes('Last name')) {
              translatedDetail = detail.replace('Last name', 'Apellido')
            }

            // Set the error on the specific field
            if (detail.toLowerCase().includes('email')) {
              form.setError('email', { message: translatedDetail })
            } else if (detail.toLowerCase().includes('password')) {
              form.setError('password', { message: translatedDetail })
            } else if (
              detail.toLowerCase().includes('first name') ||
              detail.toLowerCase().includes('first_name')
            ) {
              form.setError('first_name', { message: translatedDetail })
            } else if (
              detail.toLowerCase().includes('last name') ||
              detail.toLowerCase().includes('last_name')
            ) {
              form.setError('last_name', { message: translatedDetail })
            }
          })
        } else {
          // Show general error message
          toast.error('Error en el registro', {
            description: getErrorMessage(error),
          })
        }
      } else {
        // Handle unexpected errors
        toast.error('Error en el registro', {
          description:
            'Ocurrió un error inesperado. Por favor intenta de nuevo.',
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
        <div className='grid grid-cols-2 gap-3'>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder='Juan' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='last_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder='Pérez' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  placeholder='nombre@ejemplo.com'
                  type='email'
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
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password_confirmation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='mt-2' disabled={isLoading} type='submit'>
          {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
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
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
