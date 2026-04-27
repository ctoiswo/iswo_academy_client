import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearch } from '@tanstack/react-router'
import { academyService } from '@/services/academy-service'
import type { Academy } from '@/types'
import { ArrowLeft, ArrowRight, Loader2, Rocket, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { StepAccount } from './step-account'
import { StepBasicInfo } from './step-basic-info'
import { StepBranding } from './step-branding'
import { StepIndicator } from './step-indicator'
import { StepSettings } from './step-settings'
import { StepSuccess } from './step-success'

const createAcademySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
  academy_category_id: z.number().optional(),
  slug: z.string().optional(),
  is_public: z.boolean(),
  subscription_required: z.boolean(),
  monthly_price: z.number().min(0).optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
})

export type CreateAcademyFormValues = z.infer<typeof createAcademySchema>

const ACADEMY_STEPS = ['basicInfo', 'branding', 'settings'] as const
type AcademyStep = (typeof ACADEMY_STEPS)[number]
type Step = 'account' | AcademyStep

const STEP_LABELS_WITH_ACCOUNT = [
  'Cuenta',
  'Información',
  'Branding',
  'Configuración',
]
const STEP_LABELS_NO_ACCOUNT = ['Información', 'Branding', 'Configuración']

export function CreateAcademyForm() {
  const { t } = useTranslation()
  const { isAuthenticated, isInitialized, refreshAcademies } = useAuthStore()
  const search = useSearch({ from: '/create-academy/' })
  const loginMode = search.mode === 'login'
  // Start conservatively at 'account'; useEffect will advance to 'basicInfo'
  // once the auth store finishes initializing (avoids the race on page reload).
  const [currentStep, setCurrentStep] = useState<Step>('account')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdAcademy, setCreatedAcademy] = useState<Academy | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  // Once the auth store resolves, skip the account step if already logged in.
  useEffect(() => {
    if (isInitialized && isAuthenticated && currentStep === 'account') {
      setCurrentStep('basicInfo')
    }
  }, [isInitialized, isAuthenticated])

  const needsAccount = !isAuthenticated

  const form = useForm<CreateAcademyFormValues>({
    resolver: zodResolver(createAcademySchema),
    defaultValues: {
      name: '',
      description: '',
      is_public: true,
      subscription_required: false,
      slug: '',
      mission: '',
      vision: '',
    },
    mode: 'onTouched',
  })

  const stepLabels = needsAccount
    ? STEP_LABELS_WITH_ACCOUNT
    : STEP_LABELS_NO_ACCOUNT
  const currentStepIndex =
    currentStep === 'account'
      ? 0
      : (needsAccount ? 1 : 0) +
        ACADEMY_STEPS.indexOf(currentStep as AcademyStep)

  const goToStep = useCallback((newStep: Step) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(newStep)
      setIsTransitioning(false)
    }, 150)
  }, [])

  // Auto-generate slug when name changes (step 1 -> step 2)
  const syncSlug = () => {
    const name = form.getValues('name')
    const currentSlug = form.getValues('slug')
    if (name && !currentSlug) {
      form.setValue(
        'slug',
        name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      )
    }
  }

  const handleNext = async () => {
    const stepFields: Partial<Record<Step, (keyof CreateAcademyFormValues)[]>> =
      {
        basicInfo: ['name', 'description'],
        branding: ['slug'],
        settings: [
          'is_public',
          'subscription_required',
          'monthly_price',
          'mission',
          'vision',
        ],
      }
    const fields = stepFields[currentStep]
    if (fields) {
      const valid = await form.trigger(fields)
      if (!valid) return
    }

    if (currentStep === 'basicInfo') {
      syncSlug()
      goToStep('branding')
    } else if (currentStep === 'branding') {
      goToStep('settings')
    }
  }

  const handleBack = () => {
    if (currentStep === 'branding') goToStep('basicInfo')
    else if (currentStep === 'settings') goToStep('branding')
    else if (currentStep === 'basicInfo' && needsAccount) goToStep('account')
  }

  const onSubmit = async (values: CreateAcademyFormValues) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: values.name,
        description: values.description,
        ...(values.academy_category_id && {
          academy_category_id: values.academy_category_id,
        }),
        ...(values.slug && { slug: values.slug }),
        is_public: values.is_public,
        subscription_required: values.subscription_required,
        ...(values.monthly_price && { monthly_price: values.monthly_price }),
        ...(values.mission && { mission: values.mission }),
        ...(values.vision && { vision: values.vision }),
      }
      const academy = await academyService.createAcademy(payload)

      // Upload logo and banner — failures here don't block the flow
      if (logoFile) {
        try {
          await academyService.uploadAttachment(
            academy.slug,
            logoFile,
            'logo',
            'Academy Logo'
          )
        } catch {
          toast.warning('Academia creada. No se pudo subir el logo; puedes hacerlo desde la configuración.')
        }
      }
      if (bannerFile) {
        try {
          await academyService.uploadAttachment(
            academy.slug,
            bannerFile,
            'banner',
            'Academy Banner'
          )
        } catch {
          toast.warning('No se pudo subir el banner; puedes hacerlo desde la configuración.')
        }
      }

      setCreatedAcademy(academy)
      toast.success(t('createAcademy.success.toastMessage'))
      // Refresh the auth store so the new academy appears in academyData
      // and the dashboard button navigates to the correct slug
      await refreshAcademies()
    } catch (error: unknown) {
      const apiMessage =
        (error as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message
      const msg = apiMessage ?? t('createAcademy.errors.generic')
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (createdAcademy) {
    return <StepSuccess academy={createdAcademy} />
  }

  // Show spinner while auth store is still reading localStorage / refreshing tokens.
  // Without this guard the wizard always starts at step 'account' on reload.
  if (!isInitialized) {
    return (
      <div className='text-muted-foreground flex flex-col items-center justify-center gap-3 py-24'>
        <RefreshCw className='text-primary size-6 animate-spin' />
        <span className='text-sm'>Verificando sesión...</span>
      </div>
    )
  }

  return (
    <div className='flex w-full flex-col gap-8'>
      {/* Step indicator */}
      <StepIndicator
        currentStep={currentStepIndex + 1}
        totalSteps={stepLabels.length}
        labels={stepLabels}
      />

      {/* Form card */}
      <div className='border-border bg-card shadow-background/50 relative overflow-hidden rounded-xl border p-6 shadow-lg md:p-8 lg:p-10'>
        {/* Subtle glow at top */}
        <div className='via-primary/50 absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent' />

        {/* Step content */}
        <div
          className='transition-opacity duration-150 ease-in-out'
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          {currentStep === 'account' ? (
            <StepAccount
              onSuccess={() => goToStep('basicInfo')}
              initialPhase={loginMode ? 'login' : 'register'}
            />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {currentStep === 'basicInfo' && <StepBasicInfo form={form} />}
                {currentStep === 'branding' && (
                  <StepBranding
                    form={form}
                    logoFile={logoFile}
                    onLogoChange={setLogoFile}
                    bannerFile={bannerFile}
                    onBannerChange={setBannerFile}
                  />
                )}
                {currentStep === 'settings' && <StepSettings form={form} />}
              </form>
            </Form>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className='flex items-center justify-between'>
        <Button
          type='button'
          variant='ghost'
          onClick={handleBack}
          disabled={currentStep === (needsAccount ? 'account' : 'basicInfo')}
          className='text-muted-foreground hover:text-foreground gap-2 transition-all duration-300 disabled:opacity-0'
        >
          <ArrowLeft className='size-4' />
          {t('createAcademy.actions.back')}
        </Button>

        {currentStep !== 'settings' && currentStep !== 'account' ? (
          <Button
            type='button'
            onClick={handleNext}
            className='bg-primary text-primary-foreground hover:bg-primary/90 gap-2 transition-all duration-300 hover:shadow-[0_0_16px_rgba(99,102,241,0.3)]'
          >
            {t('createAcademy.actions.next')}
            <ArrowRight className='size-4' />
          </Button>
        ) : currentStep === 'account' ? (
          // account step has its own submit button inside StepAccount
          <span />
        ) : (
          <Button
            type='button'
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className='bg-primary text-primary-foreground hover:bg-primary/90 gap-2 transition-all duration-300 hover:shadow-[0_0_16px_rgba(99,102,241,0.3)] disabled:opacity-40'
          >
            {isSubmitting ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              <Rocket className='size-4' />
            )}
            {t('createAcademy.actions.create')}
          </Button>
        )}
      </div>
    </div>
  )
}
