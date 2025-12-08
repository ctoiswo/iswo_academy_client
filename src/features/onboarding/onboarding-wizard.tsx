import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import profileService from '@/services/profile-service'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, User, MapPin, Share2, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  PersonalDetailsStep,
  AddressStep,
  SocialNetworksStep,
  ReviewStep,
} from './steps'

export type WizardStep = 'personal' | 'address' | 'social' | 'review'

interface StepConfig {
  id: WizardStep
  title: string
  description: string
  icon: React.ElementType
  order: number
}

const steps: StepConfig[] = [
  {
    id: 'personal',
    title: 'Detalles Personales',
    description: 'Cuéntanos sobre ti',
    icon: User,
    order: 1,
  },
  {
    id: 'address',
    title: 'Dirección',
    description: 'Dónde te encuentras',
    icon: MapPin,
    order: 2,
  },
  {
    id: 'social',
    title: 'Redes Sociales',
    description: 'Conecta tus perfiles',
    icon: Share2,
    order: 3,
  },
  {
    id: 'review',
    title: 'Revisión',
    description: 'Verifica tu información',
    icon: CheckCircle2,
    order: 4,
  },
]

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('personal')
  const [completedSteps, setCompletedSteps] = useState<Set<WizardStep>>(
    new Set()
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { refreshUser } = useAuthStore()

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const markStepComplete = (step: WizardStep) => {
    setCompletedSteps((prev) => new Set([...prev, step]))
  }

  const goToNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    }
  }

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id)
    }
  }

  const handleCompleteOnboarding = async () => {
    try {
      setIsSubmitting(true)
      await profileService.completeOnboarding()
      await refreshUser()
      toast.success('¡Bienvenido! Tu perfil está completo')
      navigate({ to: '/dashboard' })
    } catch (_error) {
      toast.error('Error al completar el onboarding')
      // console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkipForNow = () => {
    navigate({ to: '/dashboard' })
  }

  return (
    <div className='container mx-auto max-w-5xl px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 rounded-lg p-2'>
              <Sparkles className='text-primary h-6 w-6' />
            </div>
            <div>
              <h1 className='text-3xl font-bold'>Completa tu Perfil</h1>
              <p className='text-muted-foreground'>
                Ayúdanos a conocerte mejor para personalizar tu experiencia
              </p>
            </div>
          </div>
          <Button variant='ghost' size='icon' onClick={handleSkipForNow}>
            <X className='h-4 w-4' />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Progreso</span>
            <span className='font-medium'>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className='h-2' />
        </div>
      </div>

      {/* Steps Navigator */}
      <div className='mb-6 grid grid-cols-4 gap-4'>
        {steps.map((step) => {
          const Icon = step.icon
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.has(step.id)
          const isAccessible = step.order <= currentStepIndex + 1

          return (
            <button
              key={step.id}
              onClick={() => isAccessible && setCurrentStep(step.id)}
              disabled={!isAccessible}
              className={`relative rounded-lg border-2 p-4 text-left transition-all ${isActive ? 'border-primary bg-primary/5' : 'border-border'} ${isCompleted ? 'border-green-500 bg-green-500/5' : ''} ${!isAccessible ? 'cursor-not-allowed opacity-50' : 'hover:border-primary/50 cursor-pointer'} `}
            >
              <div className='flex items-start gap-3'>
                <div
                  className={`rounded-lg p-2 ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'} ${isCompleted ? 'bg-green-500 text-white' : ''} `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className='h-4 w-4' />
                  ) : (
                    <Icon className='h-4 w-4' />
                  )}
                </div>
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center gap-2'>
                    <p className='truncate text-sm font-medium'>{step.title}</p>
                    {isCompleted && (
                      <Badge variant='outline' className='text-xs'>
                        ✓
                      </Badge>
                    )}
                  </div>
                  <p className='text-muted-foreground truncate text-xs'>
                    {step.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Main Content */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {steps.find((s) => s.id === currentStep)?.title}
              </CardTitle>
              <CardDescription>
                {steps.find((s) => s.id === currentStep)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentStep === 'personal' && (
                <PersonalDetailsStep
                  onNext={() => {
                    markStepComplete('personal')
                    goToNextStep()
                  }}
                  onSkip={goToNextStep}
                />
              )}
              {currentStep === 'address' && (
                <AddressStep
                  onNext={() => {
                    markStepComplete('address')
                    goToNextStep()
                  }}
                  onBack={goToPreviousStep}
                  onSkip={goToNextStep}
                />
              )}
              {currentStep === 'social' && (
                <SocialNetworksStep
                  onNext={() => {
                    markStepComplete('social')
                    goToNextStep()
                  }}
                  onBack={goToPreviousStep}
                  onSkip={goToNextStep}
                />
              )}
              {currentStep === 'review' && (
                <ReviewStep
                  onComplete={handleCompleteOnboarding}
                  onBack={goToPreviousStep}
                  isSubmitting={isSubmitting}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Bottom Actions */}
      <div className='mt-6 flex items-center justify-between'>
        <Button variant='outline' onClick={handleSkipForNow}>
          Completar más tarde
        </Button>
        <div className='text-muted-foreground text-sm'>
          Paso {currentStepIndex + 1} de {steps.length}
        </div>
      </div>
    </div>
  )
}
