import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from '@tanstack/react-router'
import { authApi } from '@/services'
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
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

interface ResetPasswordFormProps {
  token: string
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(timer)
  }, [])

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

      await authApi.resetPassword(token, data.password, data.password_confirmation)

      form.reset()
      navigate({ to: '/password-changed' })
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage)

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

      if (isApiError(error)) {
        if (
          error.code === 'INVALID_RESET_TOKEN' ||
          error.code === 'EXPIRED_RESET_TOKEN'
        ) {
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
          {t('auth.resetPassword.title')}
        </h1>
        <p className='text-sm text-muted-foreground leading-relaxed text-center max-w-sm mx-auto'>
          {t('auth.resetPassword.subtitle')}
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
        {/* Password */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password' className='text-sm text-foreground/80'>
            {t('auth.resetPassword.password')}
          </Label>
          <div className='relative group'>
            <Lock
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 size-4 transition-colors duration-200',
                focusedField === 'password'
                  ? 'text-primary'
                  : 'text-muted-foreground/50'
              )}
            />
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.resetPassword.passwordPlaceholder')}
              disabled={isLoading}
              className='pl-10 pr-10 h-11 bg-card/50 border-border/50 focus:border-primary/60 focus:bg-card transition-all duration-200'
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              {...form.register('password')}
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
                <EyeOff className='size-4 text-muted-foreground/50' />
              ) : (
                <Eye className='size-4 text-muted-foreground/50' />
              )}
            </Button>
          </div>
          {form.formState.errors.password && (
            <p className='text-xs text-destructive'>
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        {/* Password confirmation */}
        <div className='flex flex-col gap-2'>
          <Label
            htmlFor='password_confirmation'
            className='text-sm text-foreground/80'
          >
            {t('auth.resetPassword.passwordConfirmation')}
          </Label>
          <div className='relative group'>
            <Lock
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 size-4 transition-colors duration-200',
                focusedField === 'password_confirmation'
                  ? 'text-primary'
                  : 'text-muted-foreground/50'
              )}
            />
            <Input
              id='password_confirmation'
              type={showPasswordConfirmation ? 'text' : 'password'}
              placeholder={t('auth.resetPassword.passwordConfirmationPlaceholder')}
              disabled={isLoading}
              className='pl-10 pr-10 h-11 bg-card/50 border-border/50 focus:border-primary/60 focus:bg-card transition-all duration-200'
              onFocus={() => setFocusedField('password_confirmation')}
              onBlur={() => setFocusedField(null)}
              {...form.register('password_confirmation')}
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
                <EyeOff className='size-4 text-muted-foreground/50' />
              ) : (
                <Eye className='size-4 text-muted-foreground/50' />
              )}
            </Button>
          </div>
          {form.formState.errors.password_confirmation && (
            <p className='text-xs text-destructive'>
              {form.formState.errors.password_confirmation.message}
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
              {t('auth.resetPassword.button')}
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
          {t('auth.resetPassword.signIn')}
        </Link>
      </div>
    </div>
  )
}
