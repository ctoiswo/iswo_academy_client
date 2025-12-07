import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '@/services'
import { ArrowRight, Loader2 } from 'lucide-react'
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
  z.object({
    email: z
      .string()
      .min(1, t('auth.forgotPassword.validation.emailRequired'))
      .email(t('auth.forgotPassword.validation.emailInvalid')),
  })

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const formSchema = getFormSchema(t)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      const response = await authApi.forgotPassword(data.email)

      setIsSuccess(true)
      form.reset()
      toast.success(response.message)
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)

      // Si es error de validación, asignar mensajes a campos específicos
      if (isApiError(error) && isValidationError(error)) {
        const validationDetails = getValidationDetails(error)

        if (validationDetails.email) {
          form.setError('email', { message: validationDetails.email })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className='space-y-4 text-center'>
        <div className='text-sm text-green-600'>
          ✓ {t('auth.forgotPassword.successMessage')}
        </div>
        <p className='text-muted-foreground text-sm'>
          {t('auth.signUpSuccess.checkEmail')}
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.forgotPassword.email')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  type='email'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading} type='submit'>
          {isLoading ? (
            <>
              {t('auth.forgotPassword.sending')}
              <Loader2 className='ml-2 h-4 w-4 animate-spin' />
            </>
          ) : (
            <>
              {t('auth.forgotPassword.button')}
              <ArrowRight className='ml-2 h-4 w-4' />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
