import { useState, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Loader2,
  Mail,
  User,
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

// ─── Schemas ──────────────────────────────────────────────────────────────────

const registerSchema = z
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
      .min(8, 'Mínimo 8 caracteres')
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Necesita mayúscula, minúscula y número'
      ),
    password_confirmation: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
  })

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Correo no válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

type RegisterValues = z.infer<typeof registerSchema>
type LoginValues = z.infer<typeof loginSchema>

// ─── Password strength ────────────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const checks = useMemo(
    () => [
      { label: 'Mínimo 8 caracteres', met: password.length >= 8 },
      { label: 'Una mayúscula', met: /[A-Z]/.test(password) },
      { label: 'Un número', met: /[0-9]/.test(password) },
      { label: 'Un especial', met: /[^A-Za-z0-9]/.test(password) },
    ],
    [password]
  )
  const strength = checks.filter((c) => c.met).length
  if (!password) return null
  return (
    <div className='mt-1 flex flex-col gap-2'>
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
      <div className='grid grid-cols-2 gap-1'>
        {checks.map((c) => (
          <div
            key={c.label}
            className={cn(
              'flex items-center gap-1 text-[11px] transition-colors',
              c.met ? 'text-emerald-400' : 'text-muted-foreground/60'
            )}
          >
            {c.met ? (
              <Check className='size-3 shrink-0' />
            ) : (
              <X className='size-3 shrink-0' />
            )}
            {c.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface StepAccountProps {
  onSuccess: () => void
  initialPhase?: 'register' | 'login'
}

type Phase = 'register' | 'verify' | 'login'

export function StepAccount({
  onSuccess,
  initialPhase = 'register',
}: StepAccountProps) {
  const [phase, setPhase] = useState<Phase>(initialPhase)
  const [showPassword, setShowPassword] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const { register: registerUser, login } = useAuthStore()

  // ── Register form ──────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) })

  const password = watch('password', '')

  async function onRegister(data: RegisterValues) {
    try {
      await registerUser(data)
      setPendingEmail(data.email)
      setPhase('verify')
      toast.success('¡Cuenta creada!', {
        description: 'Revisa tu correo para confirmar tu cuenta.',
      })
    } catch (error: unknown) {
      toast.error('Error al registrarse', {
        description: getErrorMessage(error),
      })
      if (isApiError(error) && isValidationError(error)) {
        const details = getValidationDetails(error)
        Object.entries(details).forEach(([field, message]) => {
          if (
            ['email', 'password', 'first_name', 'last_name'].includes(field)
          ) {
            setError(field as keyof RegisterValues, { message })
          }
        })
      }
    }
  }

  // ── Login form (after verifying email) ────────────────────────────────────

  const {
    register: regLogin,
    handleSubmit: handleLoginSubmit,
    setError: setLoginError,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: pendingEmail },
  })

  async function onLogin(data: LoginValues) {
    try {
      await login(data)
      toast.success('¡Sesión iniciada! Continuemos con tu academia.')
      onSuccess()
    } catch (error: unknown) {
      const msg = getErrorMessage(error)
      toast.error(msg)
      setLoginError('password', { message: msg })
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase === 'login') {
    return (
      <div className='animate-in fade-in-0 slide-in-from-right-4 flex flex-col gap-6 duration-500'>
        <div className='flex flex-col gap-1.5'>
          <h2 className='text-2xl font-bold tracking-tight'>Inicia sesión</h2>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Introduce tus credenciales para continuar con la configuración de tu
            academia.
          </p>
        </div>

        <form
          onSubmit={handleLoginSubmit(onLogin)}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col gap-2'>
            <Label htmlFor='login-email'>Correo electrónico</Label>
            <div className='relative'>
              <Mail className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
              <Input
                id='login-email'
                type='email'
                placeholder='tu@correo.com'
                className='bg-card/50 border-border/50 focus:border-primary/60 h-11 pl-10'
                {...regLogin('email')}
              />
            </div>
            {loginErrors.email && (
              <p className='text-destructive text-xs'>
                {loginErrors.email.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='login-password'>Contraseña</Label>
            <div className='relative'>
              <Lock className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
              <Input
                id='login-password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Tu contraseña'
                className='bg-card/50 border-border/50 focus:border-primary/60 h-11 pr-10 pl-10'
                {...regLogin('password')}
              />
              <button
                type='button'
                onClick={() => setShowPassword((v) => !v)}
                className='text-muted-foreground/50 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors'
              >
                {showPassword ? (
                  <EyeOff className='size-4' />
                ) : (
                  <Eye className='size-4' />
                )}
              </button>
            </div>
            {loginErrors.password && (
              <p className='text-destructive text-xs'>
                {loginErrors.password.message}
              </p>
            )}
          </div>

          <Button
            type='submit'
            disabled={isLoginSubmitting}
            className='bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-semibold'
          >
            {isLoginSubmitting ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <>
                Iniciar sesión y continuar
                <ArrowRight className='ml-2 size-4' />
              </>
            )}
          </Button>
        </form>

        <button
          type='button'
          onClick={() => setPhase('register')}
          className='text-muted-foreground hover:text-foreground text-center text-xs transition-colors'
        >
          ¿No tienes cuenta?{' '}
          <span className='text-primary underline underline-offset-2'>
            Regístrate aquí
          </span>
        </button>
      </div>
    )
  }

  if (phase === 'verify') {
    return (
      <div className='animate-in fade-in-0 slide-in-from-right-4 flex flex-col gap-6 duration-500'>
        <div className='flex flex-col gap-1.5'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Confirma tu correo
          </h2>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            Te enviamos un enlace de confirmación a{' '}
            <span className='text-foreground font-medium'>{pendingEmail}</span>.
            Una vez confirmado, inicia sesión aquí para continuar.
          </p>
        </div>

        <form
          onSubmit={handleLoginSubmit(onLogin)}
          className='flex flex-col gap-4'
        >
          <div className='flex flex-col gap-2'>
            <Label htmlFor='login-email'>Correo electrónico</Label>
            <div className='relative'>
              <Mail className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
              <Input
                id='login-email'
                type='email'
                className='bg-card/50 border-border/50 focus:border-primary/60 h-11 pl-10'
                {...regLogin('email')}
              />
            </div>
            {loginErrors.email && (
              <p className='text-destructive text-xs'>
                {loginErrors.email.message}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-2'>
            <Label htmlFor='login-password'>Contraseña</Label>
            <div className='relative'>
              <Lock className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
              <Input
                id='login-password'
                type={showPassword ? 'text' : 'password'}
                className='bg-card/50 border-border/50 focus:border-primary/60 h-11 pr-10 pl-10'
                {...regLogin('password')}
              />
              <button
                type='button'
                onClick={() => setShowPassword((v) => !v)}
                className='text-muted-foreground/50 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors'
              >
                {showPassword ? (
                  <EyeOff className='size-4' />
                ) : (
                  <Eye className='size-4' />
                )}
              </button>
            </div>
            {loginErrors.password && (
              <p className='text-destructive text-xs'>
                {loginErrors.password.message}
              </p>
            )}
          </div>

          <Button
            type='submit'
            disabled={isLoginSubmitting}
            className='bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-semibold'
          >
            {isLoginSubmitting ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <>
                Iniciar sesión y continuar
                <ArrowRight className='ml-2 size-4' />
              </>
            )}
          </Button>
        </form>

        <button
          type='button'
          onClick={() => setPhase('register')}
          className='text-muted-foreground hover:text-foreground text-center text-xs transition-colors'
        >
          ¿Usaste otro correo?{' '}
          <span className='text-primary underline underline-offset-2'>
            Volver atrás
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className='animate-in fade-in-0 slide-in-from-right-4 flex flex-col gap-6 duration-500'>
      <div className='flex flex-col gap-1.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Crea tu cuenta</h2>
        <p className='text-muted-foreground text-sm leading-relaxed'>
          Ingresa tus datos para comenzar a configurar tu academia.
        </p>
      </div>

      <form onSubmit={handleSubmit(onRegister)} className='flex flex-col gap-4'>
        {/* Name row */}
        <div className='grid grid-cols-2 gap-3'>
          {(
            [
              { id: 'first_name', label: 'Nombre', placeholder: 'Juan' },
              { id: 'last_name', label: 'Apellido', placeholder: 'Pérez' },
            ] as const
          ).map(({ id, label, placeholder }) => (
            <div key={id} className='flex flex-col gap-2'>
              <Label htmlFor={id}>{label}</Label>
              <div className='relative'>
                <User className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
                <Input
                  id={id}
                  placeholder={placeholder}
                  className='bg-card/50 border-border/50 focus:border-primary/60 h-11 pl-10'
                  {...register(id)}
                />
              </div>
              {errors[id] && (
                <p className='text-destructive text-xs'>
                  {errors[id]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Email */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='email'>Correo electrónico</Label>
          <div className='relative'>
            <Mail className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
            <Input
              id='email'
              type='email'
              placeholder='tu@correo.com'
              className='bg-card/50 border-border/50 focus:border-primary/60 h-11 pl-10'
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className='text-destructive text-xs'>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password'>Contraseña</Label>
          <div className='relative'>
            <Lock className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='Mínimo 8 caracteres'
              className='bg-card/50 border-border/50 focus:border-primary/60 h-11 pr-10 pl-10'
              {...register('password')}
            />
            <button
              type='button'
              onClick={() => setShowPassword((v) => !v)}
              className='text-muted-foreground/50 hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors'
            >
              {showPassword ? (
                <EyeOff className='size-4' />
              ) : (
                <Eye className='size-4' />
              )}
            </button>
          </div>
          <PasswordStrength password={password} />
          {errors.password && (
            <p className='text-destructive text-xs'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Password confirmation */}
        <div className='flex flex-col gap-2'>
          <Label htmlFor='password_confirmation'>Confirmar contraseña</Label>
          <div className='relative'>
            <Lock className='text-muted-foreground/50 absolute top-1/2 left-3 size-4 -translate-y-1/2' />
            <Input
              id='password_confirmation'
              type='password'
              placeholder='Repite tu contraseña'
              className='bg-card/50 border-border/50 focus:border-primary/60 h-11 pl-10'
              {...register('password_confirmation')}
            />
          </div>
          {errors.password_confirmation && (
            <p className='text-destructive text-xs'>
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        <Button
          type='submit'
          disabled={isSubmitting}
          className='bg-primary text-primary-foreground hover:bg-primary/90 h-11 text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-300 hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
        >
          {isSubmitting ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <>
              Crear cuenta y continuar
              <ArrowRight className='ml-2 size-4' />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
