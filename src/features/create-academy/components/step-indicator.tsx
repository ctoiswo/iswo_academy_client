import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className='flex w-full max-w-md mx-auto items-center justify-center gap-0'>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <div key={i} className='flex items-center flex-1 last:flex-none'>
            <div className='flex flex-col items-center gap-2'>
              <div
                className={cn(
                  'relative flex items-center justify-center size-10 rounded-full text-sm font-semibold transition-all duration-500 ease-out',
                  isCompleted &&
                    'bg-primary text-primary-foreground scale-100',
                  isActive &&
                    'bg-primary text-primary-foreground scale-110 shadow-[0_0_20px_rgba(99,102,241,0.45)]',
                  !isCompleted &&
                    !isActive &&
                    'bg-secondary text-muted-foreground border border-border'
                )}
              >
                {isCompleted ? (
                  <Check className='size-5 animate-in zoom-in-50 duration-300' />
                ) : (
                  <span>{stepNum}</span>
                )}
                {isActive && (
                  <span className='absolute inset-0 rounded-full animate-ping bg-primary/20' />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-300 whitespace-nowrap',
                  isActive
                    ? 'text-primary'
                    : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                )}
              >
                {labels[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div className='flex-1 mx-3 mb-6'>
                <div className='relative h-0.5 bg-border rounded-full overflow-hidden'>
                  <div
                    className='absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700 ease-out'
                    style={{
                      width: isCompleted ? '100%' : isActive ? '50%' : '0%',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
