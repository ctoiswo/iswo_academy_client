import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { IconFacebook, IconGithub } from '@/assets/brand-icons'
import { useAuthStore } from '@/stores/auth-store'
import { getErrorMessage, isApiError } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import { CustomButton } from '@/components/ui/custom-button'
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

export function AnimatedSignUpForm({
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      await register(data)
      navigate({ to: '/sign-up-success' })

      toast.success('¡Cuenta creada exitosamente!', {
        description:
          'Por favor revisa tu correo electrónico para confirmar tu cuenta.',
      })

      form.reset()
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn('grid gap-4', className)}
          {...props}
        >
        <motion.div className='grid grid-cols-2 gap-3' variants={itemVariants}>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Nombre</FormLabel>
                <FormControl>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input 
                      placeholder='Juan' 
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 text-black" 
                      {...field} 
                    />
                  </motion.div>
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
                <FormLabel className="text-sm font-medium text-gray-700">Apellido</FormLabel>
                <FormControl>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input 
                      placeholder='Pérez' 
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 text-black" 
                      {...field} 
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Correo electrónico</FormLabel>
                <FormControl>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      placeholder='nombre@ejemplo.com'
                      type='email'
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 text-black"
                      {...field}
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Contraseña</FormLabel>
                <FormControl>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PasswordInput 
                      placeholder='********' 
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 text-black"
                      {...field} 
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FormField
            control={form.control}
            name='password_confirmation'
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Confirmar contraseña</FormLabel>
                <FormControl>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <PasswordInput 
                      placeholder='********' 
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 text-black"
                      {...field} 
                    />
                  </motion.div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <CustomButton
            className='w-full mt-3'
            variant='primary'
            isLoading={isLoading}
            disabled={isLoading}
            type='submit'
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </CustomButton>
        </motion.div>

        <motion.div className='relative my-3' variants={itemVariants}>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-gray-200' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-white text-gray-500 px-3 font-medium'>
              O continúa con
            </span>
          </div>
        </motion.div>

        <motion.div className='grid grid-cols-2 gap-3' variants={itemVariants}>
          <CustomButton
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconGithub className='h-4 w-4 mr-2' /> GitHub
          </CustomButton>
          
          <CustomButton
            variant='outline'
            className='w-full'
            type='button'
            disabled={isLoading}
          >
            <IconFacebook className='h-4 w-4 mr-2' /> Facebook
          </CustomButton>
        </motion.div>
        </form>
      </motion.div>
    </Form>
  )
}