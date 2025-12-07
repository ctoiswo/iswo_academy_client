import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { authApi } from '@/services'
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { isApiError } from '@/lib/api-client'
import {
  getErrorMessage,
  getValidationDetails,
  isValidationError,
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

const getFormSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z
        .string()
        .min(8, t('auth.resetPassword.validation.passwordMin'))
        .regex(/[A-Z]/, t('auth.resetPassword.validation.passwordUppercase'))
        .regex(/[a-z]/, t('auth.resetPassword.validation.passwordLowercase'))
        .regex(/[0-9]/, t('auth.resetPassword.validation.passwordNumber')),
      password_confirmation: z
        .string()
        .min(
          1,
          t('auth.resetPassword.validation.passwordConfirmationRequired')
        ),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t('auth.resetPassword.validation.passwordsMismatch'),
      path: ['password_confirmation'],
    })

interface ResetPasswordFormProps extends React.HTMLAttributes<HTMLFormElement> {
  token: string
}

export function ResetPasswordForm({
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false)

  const formSchema = getFormSchema(t)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const response = await authApi.resetPassword(
        token,
        data.password,
        data.password_confirmation
      )

      toast.success(response.message)
      form.reset()

      // Redirect to sign-in page after successful reset
      navigate({ to: '/sign-in' })
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)

      // Si es error de validación, asignar mensajes a campos específicos
      if (isApiError(error) && isValidationError(error)) {
        const validationDetails = getValidationDetails(error)

        if (validationDetails.password) {
          form.setError('password', { message: validationDetails.password })
        }
        if (validationDetails.password_confirmation) {
          form.setError('password_confirmation', {
            message: validationDetails.password_confirmation,
          })
        }
      }

      // Manejar tokens inválidos/expirados
      if (isApiError(error)) {
        if (
          error.code === 'INVALID_RESET_TOKEN' ||
          error.code === 'EXPIRED_RESET_TOKEN'
        ) {
          // Mostrar error y redirigir a la página de recuperación
          setTimeout(() => {
            navigate({ to: '/forgot-password' })
          }, 3000)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-4', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.resetPassword.password')}</FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.resetPassword.passwordPlaceholder')}
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
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
              <FormLabel>
                {t('auth.resetPassword.passwordConfirmation')}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    placeholder={t(
                      'auth.resetPassword.passwordConfirmationPlaceholder'
                    )}
                    disabled={isLoading}
                    {...field}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                    onClick={() =>
                      setShowPasswordConfirmation(!showPasswordConfirmation)
                    }
                    disabled={isLoading}
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='mt-2' disabled={isLoading} type='submit'>
          {isLoading ? (
            <>
              {t('auth.resetPassword.resetting')}
              <Loader2 className='ml-2 h-4 w-4 animate-spin' />
            </>
          ) : (
            <>
              {t('auth.resetPassword.button')}
              <ArrowRight className='ml-2 h-4 w-4' />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
