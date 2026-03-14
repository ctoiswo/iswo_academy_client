import { useState, useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  User,
  Check,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
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
import { Separator } from '@/components/ui/separator'

const formSchema = z
  .object({
    first_name: z.string().min(1, 'El nombre es obligatorio').max(50),
    last_name: z.string().min(1, 'El apellido es obligatorio').max(50),
    email: z
      .string()
      .min(1, 'El correo es obligatorio')
      .email('Correo no válido')
      .max(255),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria')
      .min(8, 'Mínimo 8 caracteres')
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Debe tener una mayúscula, una minúscula y un número'
      ),
    password_confirmation: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

type FormValues = z.infer<typeof formSchema>

function PasswordStrength({ password }: { password: string }) {
  const checks = useMemo(
    () => [
      { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
      { label: 'Una mayúscula', met: /[A-Z]/.test(password) },
      { label: 'Un número', met: /[0-9]/.test(password) },
      { label: 'Un caracter especial', met: /[^A-Za-z0-9]/.test(password) },
    ],
    [password]
  )
  const strength = checks.filter((c) => c.met).length
  if (!password) return null
  return (
    <div className='mt-2 flex flex-col gap-2.5'>
      <div className='flex gap-1'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-500',
              i < strength
                ? strength <= 1
                  ? 'bg-red-500'
                  : strength <= 2
                    ? 'bg-amber-500'
                    : strength <= 3
                      ? 'bg-yellow-400'
                      : 'bg-emerald-500'
                : 'bg-muted'
            )}
          />
        ))}
      </div>
      <div className='grid grid-cols-2 gap-1.5'>
        {checks.map((check) => (
          <div
            key={check.label}
            className={cn(
              'flex items-center gap-1.5 text-[11px] transition-colors duration-200',
              check.met ? 'text-emerald-400' : 'text-muted-foreground/60'
            )}
          >
            {check.met ? (
              <Check className='size-3 shrink-0' />
            ) : (
              <X className='size-3 shrink-0' />
            )}
            {check.label}
          </div>
        ))}
      </div>
    </div>
  )
}

interface SignUpFormProps {
  redirectTo?: string
}

export function SignUpForm({ redirectTo }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const navigate = useNavigate()
  const { register: registerUser } = useAuthStore()

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 200)
    return () => clearTimeout(t)
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  const password = watch('password')

  function handleOAuthLogin(provider: 'github' | 'google_oauth2') {
    const baseUrl =
      import.meta.env.VITE_API_URL?.replace('/api/v1', '') ||
      'http://localhost:3000'
    window.location.href = `${baseUrl}/auth/${provider}`
  }

  async function onSubmit(data: FormValues) {
    try {
      await registerUser(data)
      if (redirectTo) {
        sessionStorage.setItem('postAuthRedirect', redirectTo)
      }
      navigate({ to: '/sign-up-success' })
      toast.success('¡Cuenta creada exitosamente!', {
        description: 'Revisa tu correo para confirmar tu cuenta.',
      })
    } catch (error: unknown) {
      toast.error('Error en el registro', {
        description: getErrorMessage(error),
      })
      if (isApiError(error) && isValidationError(error)) {
        const details = getValidationDetails(error)
        Object.entries(details).forEach(([field, message]) => {
          if (
            ['email', 'password', 'first_name', 'last_name'].includes(field)
          ) {
            setError(field as keyof FormValues, { message })
          }
        })
      }
    }
  }

  return (
    <div className='flex flex-col gap-7'>
      {/* Header */}
      <div
        className={cn(
          'flex flex-col gap-2 transition-all duration-500',
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <h1
          className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Crear cuenta
        </h1>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          Registrate gratis y comienza a aprender hoy
        </p>
      </div>

      {/* Social buttons */}
      <div
        className={cn(
          'flex gap-3 transition-all delay-100 duration-500',
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <Button
          type='button'
          variant='outline'
          onClick={() => handleOAuthLogin('google_oauth2')}
          className='border-border/60 bg-card/50 hover:bg-secondary/50 hover:border-border h-11 flex-1 gap-2 text-sm font-medium transition-all duration-200'
        >
          <svg className='size-4' viewBox='0 0 24 24'>
            <path
              fill='#4285F4'
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z'
            />
            <path
              fill='#34A853'
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            />
            <path
              fill='#FBBC05'
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            />
            <path
              fill='#EA4335'
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            />
          </svg>
          Google
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={() => handleOAuthLogin('github')}
          className='border-border/60 bg-card/50 hover:bg-secondary/50 hover:border-border h-11 flex-1 gap-2 text-sm font-medium transition-all duration-200'
        >
          <svg className='fill-foreground size-4' viewBox='0 0 24 24'>
            <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' />
          </svg>
          GitHub
        </Button>
      </div>

      {/* Divider */}
      <div
        className={cn(
          'flex items-center gap-3 transition-all delay-150 duration-500',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Separator className='flex-1' />
        <span className='text-muted-foreground text-xs'>
          o registrate con email
        </span>
        <Separator className='flex-1' />
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          'flex flex-col gap-4 transition-all delay-200 duration-500',
          mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        {/* Name row */}
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='first_name' className='text-foreground/80 text-sm'>
              Nombre
            </Label>
            <div className='relative'>
              <User
                className={cn(
                  'absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors duration-200',
                  focusedField === 'first_name'
                    ? 'text-primary'
                    : 'text-muted-foreground/50'
                )}
              />
              <Input
                id='first_name'
                placeholder='Juan'
                className='bg-card/50 border-border/50 focus:border-primary/60 focus:bg-card h-11 pl-10 transition-all duration-200'
                onFocus={() => setFocusedField('first_name')}
                {...register('first_name')}
              />
            </div>
            {errors.first_name && (
              <p className='text-destructive text-xs'>
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='last_name' className='text-foreground/80 text-sm'>
              Apellido
            </Label>
            <div className='relative'>
              <User
                className={cn(
                  'absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors duration-200',
                  focusedField === 'last_name'
                    ? 'text-primary'
                    : 'text-muted-foreground/50'
                )}
              />
              <Input
                id='last_name'
                placeholder='Pérez'
                className='bg-card/50 border-border/50 focus:border-primary/60 focus:bg-card h-11 pl-10 transition-all duration-200'
                onFocus={() => setFocusedField('last_name')}
                {...register('last_name')}
              />
            </div>
            {errors.last_name && (
              <p className='text-destructive text-xs'>
                {errors.last_name.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email' className='text-foreground/80 text-sm'>
            Correo electronico
          </Label>
          <div className='relative'>
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
              placeholder='tu@email.com'
              className='bg-card/50 border-border/50 focus:border-primary/60 focus:bg-card h-11 pl-10 transition-all duration-200'
              onFocus={() => setFocusedField('email')}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className='text-destructive text-xs'>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password' className='text-foreground/80 text-sm'>
            Contrasena
          </Label>
          <div className='relative'>
            <Lock
              className={cn(
                'absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors duration-200',
                focusedField === 'password'
                  ? 'text-primary'
                  : 'text-muted-foreground/50'
              )}
            />
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Crea una contrasena'
              className='bg-card/50 border-border/50 focus:border-primary/60 focus:bg-card h-11 pr-10 pl-10 transition-all duration-200'
              onFocus={() => setFocusedField('password')}
              {...register('password')}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='text-muted-foreground/50 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors'
            >
              {showPassword ? (
                <EyeOff className='size-4' />
              ) : (
                <Eye className='size-4' />
              )}
            </button>
          </div>
          {errors.password && (
            <p className='text-destructive text-xs'>
              {errors.password.message}
            </p>
          )}
          <PasswordStrength password={password} />
        </div>

        {/* Password confirmation */}
        <div className='flex flex-col gap-2'>
          <Label
            htmlFor='password_confirmation'
            className='text-foreground/80 text-sm'
          >
            Confirmar contrasena
          </Label>
          <div className='relative'>
            <Lock
              className={cn(
                'absolute top-1/2 left-3 size-4 -translate-y-1/2 transition-colors duration-200',
                focusedField === 'password_confirmation'
                  ? 'text-primary'
                  : 'text-muted-foreground/50'
              )}
            />
            <Input
              id='password_confirmation'
              type='password'
              placeholder='Repite tu contrasena'
              className='bg-card/50 border-border/50 focus:border-primary/60 focus:bg-card h-11 pl-10 transition-all duration-200'
              onFocus={() => setFocusedField('password_confirmation')}
              {...register('password_confirmation')}
            />
          </div>
          {errors.password_confirmation && (
            <p className='text-destructive text-xs'>
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        {/* Terms */}
        <p className='text-muted-foreground text-[11px] leading-relaxed'>
          Al crear tu cuenta aceptas nuestros{' '}
          <a
            href='/terms'
            className='text-primary/80 hover:text-primary underline underline-offset-2 transition-colors'
          >
            Terminos de servicio
          </a>{' '}
          y{' '}
          <a
            href='/privacy'
            className='text-primary/80 hover:text-primary underline underline-offset-2 transition-colors'
          >
            Politica de privacidad
          </a>
        </p>

        {/* Submit */}
        <Button
          type='submit'
          disabled={isSubmitting}
          className='bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-full text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)] disabled:shadow-none'
        >
          {isSubmitting ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <>
              Crear cuenta
              <ArrowRight className='ml-2 size-4' />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <p
        className={cn(
          'text-muted-foreground text-center text-sm transition-all delay-300 duration-500',
          mounted ? 'opacity-100' : 'opacity-0'
        )}
      >
        Ya tienes una cuenta?{' '}
        <Link
          to='/sign-in'
          search={redirectTo ? { redirect: redirectTo } : undefined}
          className='text-primary hover:text-primary/80 font-medium transition-colors'
        >
          Inicia sesion aqui
        </Link>
      </p>
    </div>
  )
}
