import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className='mx-auto flex w-full max-w-md items-center justify-center gap-0'>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <div key={i} className='flex flex-1 items-center last:flex-none'>
            <div className='flex flex-col items-center gap-2'>
              <div
                className={cn(
                  'relative flex size-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-500 ease-out',
                  isCompleted && 'bg-primary text-primary-foreground scale-100',
                  isActive &&
                    'bg-primary text-primary-foreground scale-110 shadow-[0_0_20px_rgba(99,102,241,0.45)]',
                  !isCompleted &&
                    !isActive &&
                    'bg-secondary text-muted-foreground border-border border'
                )}
              >
                {isCompleted ? (
                  <Check className='animate-in zoom-in-50 size-5 duration-300' />
                ) : (
                  <span>{stepNum}</span>
                )}
                {isActive && (
                  <span className='bg-primary/20 absolute inset-0 animate-ping rounded-full' />
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium whitespace-nowrap transition-colors duration-300',
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
              <div className='mx-3 mb-6 flex-1'>
                <div className='bg-border relative h-0.5 overflow-hidden rounded-full'>
                  <div
                    className='bg-primary absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out'
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
