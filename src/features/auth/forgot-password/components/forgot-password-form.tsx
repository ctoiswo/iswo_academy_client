import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { authApi, getErrorMessage } from '@/lib/api-client'
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

const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Por favor ingresa tu correo electrónico')
    .email('Por favor ingresa una dirección de correo electrónico válida'),
})

export function ForgotPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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
    } catch (error: any) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)

      // Handle specific validation errors
      if (error?.type === 'ValidationError' && error?.details) {
        error.details.forEach((detail: string) => {
          if (detail.toLowerCase().includes('email')) {
            form.setError('email', { message: detail })
          }
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className='space-y-4 text-center'>
        <div className='text-sm text-green-600'>
          ✓ Las instrucciones para restablecer la contraseña han sido enviadas a
          tu dirección de correo electrónico.
        </div>
        <p className='text-muted-foreground text-sm'>
          Por favor revisa tu correo electrónico y sigue las instrucciones para
          restablecer tu contraseña. Si no ves el correo, revisa tu carpeta de
          spam.
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
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  placeholder='nombre@ejemplo.com'
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
              Enviando correo...
              <Loader2 className='ml-2 h-4 w-4 animate-spin' />
            </>
          ) : (
            <>
              Enviar correo de recuperación
              <ArrowRight className='ml-2 h-4 w-4' />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
