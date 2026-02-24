import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { authApi } from '@/services'
import { ArrowRight, ArrowLeft, Loader2, Mail, KeyRound, Send, CheckCircle2 } from 'lucide-react'
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
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        <div className='flex items-center justify-center size-14 rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-1'>
          <KeyRound className='size-7 text-primary' />
        </div>
        <h1
          className='text-2xl sm:text-3xl font-bold text-foreground tracking-tight text-center'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('auth.forgotPassword.title')}
        </h1>
        <p className='text-sm text-muted-foreground leading-relaxed text-center max-w-sm mx-auto'>
          {t('auth.forgotPassword.description')}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'flex flex-col gap-5 transition-all duration-500 delay-150',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        {/* Email */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email' className='text-sm text-foreground/80'>
            {t('auth.forgotPassword.email')}
          </Label>
          <div className='relative group'>
            <Mail
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 size-4 transition-colors duration-200',
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
              className='pl-10 h-11 bg-card/50 border-border/50 focus:border-primary/60 focus:bg-card transition-all duration-200'
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              {...form.register('email')}
            />
          </div>
          {form.formState.errors.email && (
            <p className='text-xs text-destructive'>
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type='submit'
          disabled={isLoading}
          className='w-full h-11 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] transition-all duration-300 disabled:shadow-none'
        >
          {isLoading ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <>
              {t('auth.forgotPassword.button')}
              <ArrowRight className='size-4 ml-2' />
            </>
          )}
        </Button>
      </form>

      {/* Back to sign in */}
      <div
        className={cn(
          'flex flex-col items-center gap-4 transition-all duration-500 delay-200',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Link
          to='/sign-in'
          className='flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group'
        >
          <ArrowLeft className='size-3.5 group-hover:-translate-x-0.5 transition-transform' />
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
          mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        )}
      >
        <div className='absolute inset-[-8px] rounded-full bg-primary/15 blur-xl animate-pulse' />
        <div className='relative flex items-center justify-center size-20 rounded-full bg-primary/10 border-2 border-primary/30'>
          <Send
            className={cn(
              'size-9 text-primary transition-all duration-500 delay-200',
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            )}
          />
        </div>
        <CheckCircle2
          className={cn(
            'absolute -bottom-1 -right-1 size-7 text-primary bg-background rounded-full transition-all duration-500 delay-500',
            mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          )}
        />
      </div>

      {/* Message */}
      <div
        className={cn(
          'flex flex-col gap-3 transition-all duration-700 delay-300',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )}
      >
        <h1
          className='text-2xl sm:text-3xl font-bold text-foreground tracking-tight'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('auth.forgotPassword.checkEmailTitle')}
        </h1>
        <p className='text-sm text-muted-foreground leading-relaxed max-w-sm'>
          {t('auth.forgotPassword.checkEmailDesc')}{' '}
          <span className='text-foreground font-medium'>{email}</span>.{' '}
          {t('auth.forgotPassword.checkEmailInstructions')}
        </p>
      </div>

      {/* Info card */}
      <div
        className={cn(
          'w-full rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 transition-all duration-700 delay-500',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        <div className='flex flex-col gap-2 text-xs text-muted-foreground'>
          <p>{t('auth.forgotPassword.checkSpam')}</p>
          <p>{t('auth.forgotPassword.linkExpiry')}</p>
        </div>
      </div>

      {/* Actions */}
      <div
        className={cn(
          'flex flex-col gap-3 w-full transition-all duration-700 delay-700',
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        )}
      >
        <Link to='/sign-in' className='w-full'>
          <Button
            size='lg'
            className='w-full h-11 text-sm font-semibold gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] transition-all duration-300'
          >
            {t('auth.forgotPassword.backToSignIn')}
            <ArrowRight className='size-4' />
          </Button>
        </Link>
        <button
          onClick={onResend}
          className='text-xs text-primary/70 hover:text-primary transition-colors underline underline-offset-2'
        >
          {t('auth.forgotPassword.resendEmail')}
        </button>
      </div>
    </div>
  )
}


