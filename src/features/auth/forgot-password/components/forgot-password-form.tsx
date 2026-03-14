import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { authApi } from '@/services'
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Mail,
  KeyRound,
  Send,
  CheckCircle2,
} from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Stage = 'form' | 'sent'

const getFormSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, t('auth.forgotPassword.validation.emailRequired'))
      .email(t('auth.forgotPassword.validation.emailInvalid')),
  })

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('form')
  const [sentEmail, setSentEmail] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const formSchema = getFormSchema(t)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      await authApi.forgotPassword(data.email)
      setSentEmail(data.email)
      form.reset()
      setStage('sent')
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)

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

  if (stage === 'sent') {
    return (
      <EmailSentConfirmation
        email={sentEmail}
        onResend={() => setStage('form')}
      />
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      {/* Header */}
      <div
        className={cn(
          'flex flex-col gap-3 transition-all duration-500',
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <div className='bg-primary/10 border-primary/20 mx-auto mb-1 flex size-14 items-center justify-center rounded-2xl border'>
          <KeyRound className='text-primary size-7' />
        </div>
        <h1
          className='text-foreground text-center text-2xl font-bold tracking-tight sm:text-3xl'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('auth.forgotPassword.title')}
        </h1>
        <p className='text-muted-foreground mx-auto max-w-sm text-center text-sm leading-relaxed'>
          {t('auth.forgotPassword.description')}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'flex flex-col gap-5 transition-all delay-150 duration-500',
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        {/* Email */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email' className='text-foreground/80 text-sm'>
            {t('auth.forgotPassword.email')}
          </Label>
          <div className='group relative'>
            <Mail
              className={cn(
                'absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors duration-200',
                focusedField === 'email'
                  ? 'text-primary'
                  : 'text-muted-foreground/50'
              )}
            />
            <Input
              id='email'
              type='email'
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
              disabled={isLoading}
              className='bg-card/50 border-border/50 focus:border-primary/60 focus:bg-card h-11 pl-10 transition-all duration-200'
              onFocus={() => setFocusedField('email')}
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email && (
            <p className='text-destructive text-xs'>
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type='submit'
          disabled={isLoading}
          className='bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] disabled:shadow-none'
        >
          {isLoading ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <>
              {t('auth.forgotPassword.button')}
              <ArrowRight className='ml-2 size-4' />
            </>
          )}
        </Button>
      </form>

      {/* Back to sign in */}
      <div
        className={cn(
          'flex flex-col items-center gap-4 transition-all delay-200 duration-500',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Link
          to='/sign-in'
          className='text-muted-foreground hover:text-foreground group flex items-center gap-2 text-sm transition-colors'
        >
          <ArrowLeft className='size-3.5 transition-transform group-hover:-translate-x-0.5' />
          {t('auth.forgotPassword.signIn')}
        </Link>
      </div>
    </div>
  )
}

function EmailSentConfirmation({
  email,
  onResend,
}: {
  email: string
  onResend: () => void
}) {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='flex flex-col items-center gap-8 text-center'>
      {/* Animated icon */}
      <div
        className={cn(
          'relative transition-all duration-700',
          mounted ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        )}
      >
        <div className='bg-primary/15 absolute inset-[-8px] animate-pulse rounded-full blur-xl' />
        <div className='bg-primary/10 border-primary/30 relative flex size-20 items-center justify-center rounded-full border-2'>
          <Send
            className={cn(
              'text-primary size-9 transition-all delay-200 duration-500',
              mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            )}
          />
        </div>
        <CheckCircle2
          className={cn(
            'text-primary bg-background absolute -right-1 -bottom-1 size-7 rounded-full transition-all delay-500 duration-500',
            mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          )}
        />
      </div>

      {/* Message */}
      <div
        className={cn(
          'flex flex-col gap-3 transition-all delay-300 duration-700',
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        )}
      >
        <h1
          className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('auth.forgotPassword.checkEmailTitle')}
        </h1>
        <p className='text-muted-foreground max-w-sm text-sm leading-relaxed'>
          {t('auth.forgotPassword.checkEmailDesc')}{' '}
          <span className='text-foreground font-medium'>{email}</span>.{' '}
          {t('auth.forgotPassword.checkEmailInstructions')}
        </p>
      </div>

      {/* Info card */}
      <div
        className={cn(
          'border-border/40 bg-card/50 w-full rounded-xl border p-4 backdrop-blur-sm transition-all delay-500 duration-700',
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <div className='text-muted-foreground flex flex-col gap-2 text-xs'>
          <p>{t('auth.forgotPassword.checkSpam')}</p>
          <p>{t('auth.forgotPassword.linkExpiry')}</p>
        </div>
      </div>

      {/* Actions */}
      <div
        className={cn(
          'flex w-full flex-col gap-3 transition-all delay-700 duration-700',
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        )}
      >
        <Link to='/sign-in' className='w-full'>
          <Button
            size='lg'
            className='bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full gap-2 text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
          >
            {t('auth.forgotPassword.backToSignIn')}
            <ArrowRight className='size-4' />
          </Button>
        </Link>
        <button
          onClick={onResend}
          className='text-primary/70 hover:text-primary text-xs underline underline-offset-2 transition-colors'
        >
          {t('auth.forgotPassword.resendEmail')}
        </button>
      </div>
    </div>
  )
}
