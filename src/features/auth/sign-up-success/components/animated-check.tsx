import { useState, useEffect } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AnimatedCheck() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='relative'>
      {/* Outer pulsing ring */}
      <div
        className='bg-primary/10 absolute inset-[-16px] animate-ping rounded-full'
        style={{ animationDuration: '2s' }}
      />
      {/* Glow */}
      <div className='bg-primary/20 absolute inset-[-8px] animate-pulse rounded-full blur-xl' />
      {/* Circle */}
      <div
        className={cn(
          'relative flex size-28 items-center justify-center rounded-full border-2 transition-all duration-700',
          show
            ? 'bg-primary/10 border-primary/40 scale-100'
            : 'bg-primary/5 border-primary/10 scale-75'
        )}
      >
        <CheckCircle2
          className={cn(
            'text-primary size-14 transition-all delay-200 duration-500',
            show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          )}
        />
      </div>
      {/* Floating sparkles */}
      <Sparkles
        className={cn(
          'text-primary absolute -top-3 -right-3 size-5 transition-all delay-500 duration-500',
          show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}
      />
      <Sparkles
        className={cn(
          'text-primary/60 absolute -bottom-2 -left-4 size-4 transition-all delay-700 duration-500',
          show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}
      />
      <Sparkles
        className={cn(
          'text-primary/40 absolute top-0 -left-5 size-3 transition-all delay-[900ms] duration-500',
          show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}
      />
    </div>
  )
}
