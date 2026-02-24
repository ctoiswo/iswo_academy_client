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
        className='absolute inset-[-16px] rounded-full bg-primary/10 animate-ping'
        style={{ animationDuration: '2s' }}
      />
      {/* Glow */}
      <div className='absolute inset-[-8px] rounded-full bg-primary/20 blur-xl animate-pulse' />
      {/* Circle */}
      <div
        className={cn(
          'relative flex items-center justify-center size-28 rounded-full border-2 transition-all duration-700',
          show
            ? 'bg-primary/10 border-primary/40 scale-100'
            : 'bg-primary/5 border-primary/10 scale-75'
        )}
      >
        <CheckCircle2
          className={cn(
            'size-14 text-primary transition-all duration-500 delay-200',
            show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          )}
        />
      </div>
      {/* Floating sparkles */}
      <Sparkles
        className={cn(
          'absolute -top-3 -right-3 size-5 text-primary transition-all duration-500 delay-500',
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
      />
      <Sparkles
        className={cn(
          'absolute -bottom-2 -left-4 size-4 text-primary/60 transition-all duration-500 delay-700',
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
      />
      <Sparkles
        className={cn(
          'absolute top-0 -left-5 size-3 text-primary/40 transition-all duration-500 delay-[900ms]',
          show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        )}
      />
    </div>
  )
}
