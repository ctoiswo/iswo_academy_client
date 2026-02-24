import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Loader2, Rocket } from 'lucide-react'
import { academyService } from '@/services/academy-service'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import type { Academy } from '@/types'
import { StepBasicInfo } from './step-basic-info'
import { StepBranding } from './step-branding'
import { StepSettings } from './step-settings'
import { StepSuccess } from './step-success'
import { StepIndicator } from './step-indicator'

const createAcademySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  academy_category_id: z.number().optional(),
  slug: z.string().optional(),
  logo_url: z.string().url('Ingresa una URL válida').optional().or(z.literal('')),
  banner_url: z.string().url('Ingresa una URL válida').optional().or(z.literal('')),
  is_public: z.boolean(),
  subscription_required: z.boolean(),
  monthly_price: z.number().min(0).optional(),
  mission: z.string().optional(),
  vision: z.string().optional(),
})

export type CreateAcademyFormValues = z.infer<typeof createAcademySchema>

const STEPS = ['basicInfo', 'branding', 'settings'] as const
type Step = (typeof STEPS)[number]

const STEP_LABELS = ['Información', 'Branding', 'Configuración']

export function CreateAcademyForm() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState<Step>('basicInfo')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdAcademy, setCreatedAcademy] = useState<Academy | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const form = useForm<CreateAcademyFormValues>({
    resolver: zodResolver(createAcademySchema),
    defaultValues: {
      name: '',
      description: '',
      is_public: true,
      subscription_required: false,
      logo_url: '',
      banner_url: '',
      slug: '',
      mission: '',
      vision: '',
    },
    mode: 'onTouched',
  })

  const currentStepIndex = STEPS.indexOf(currentStep)

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
      form.setValue('slug', name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))
    }
  }

  const handleNext = async () => {
    const stepFields: Record<Step, (keyof CreateAcademyFormValues)[]> = {
      basicInfo: ['name', 'description'],
      branding: ['slug', 'logo_url', 'banner_url'],
      settings: ['is_public', 'subscription_required', 'monthly_price', 'mission', 'vision'],
    }
    const valid = await form.trigger(stepFields[currentStep])
    if (!valid) return

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
  }

  const onSubmit = async (values: CreateAcademyFormValues) => {
    setIsSubmitting(true)
    try {
      const payload = {
        name: values.name,
        description: values.description,
        ...(values.academy_category_id && { academy_category_id: values.academy_category_id }),
        ...(values.slug && { slug: values.slug }),
        ...(values.logo_url && { logo_url: values.logo_url }),
        ...(values.banner_url && { banner_url: values.banner_url }),
        is_public: values.is_public,
        subscription_required: values.subscription_required,
        ...(values.monthly_price && { monthly_price: values.monthly_price }),
        ...(values.mission && { mission: values.mission }),
        ...(values.vision && { vision: values.vision }),
      }
      const academy = await academyService.createAcademy(payload)
      setCreatedAcademy(academy)
      toast.success(t('createAcademy.success.toastMessage'))
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? t('createAcademy.errors.generic')
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (createdAcademy) {
    return <StepSuccess academy={createdAcademy} />
  }

  return (
    <div className='flex flex-col gap-8 w-full'>
      {/* Step indicator */}
      <StepIndicator
        currentStep={currentStepIndex + 1}
        totalSteps={3}
        labels={STEP_LABELS}
      />

      {/* Form card */}
      <div className='relative rounded-xl border border-border bg-card p-6 md:p-8 lg:p-10 shadow-lg shadow-background/50 overflow-hidden'>
        {/* Subtle glow at top */}
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent' />

        {/* Step content */}
        <div
          className='transition-opacity duration-150 ease-in-out'
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {currentStep === 'basicInfo' && <StepBasicInfo form={form} />}
              {currentStep === 'branding' && <StepBranding form={form} />}
              {currentStep === 'settings' && <StepSettings form={form} />}
            </form>
          </Form>
        </div>
      </div>

      {/* Navigation */}
      <div className='flex items-center justify-between'>
        <Button
          type='button'
          variant='ghost'
          onClick={handleBack}
          disabled={currentStep === 'basicInfo'}
          className='gap-2 text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all duration-300'
        >
          <ArrowLeft className='size-4' />
          {t('createAcademy.actions.back')}
        </Button>

        {currentStep !== 'settings' ? (
          <Button
            type='button'
            onClick={handleNext}
            className='gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_16px_rgba(99,102,241,0.3)]'
          >
            {t('createAcademy.actions.next')}
            <ArrowRight className='size-4' />
          </Button>
        ) : (
          <Button
            type='button'
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className='gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all duration-300 hover:shadow-[0_0_16px_rgba(99,102,241,0.3)]'
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
