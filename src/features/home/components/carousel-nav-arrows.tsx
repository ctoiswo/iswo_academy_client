import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselNavArrowsProps {
  onPrev: () => void
  onNext: () => void
}

export function CarouselNavArrows({ onPrev, onNext }: CarouselNavArrowsProps) {
  return (
    <div className='absolute right-6 bottom-4 z-20 flex gap-2'>
      <button
        onClick={onPrev}
        className='border-border/50 bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/40 flex size-9 items-center justify-center rounded-lg border backdrop-blur-sm transition-colors'
        aria-label='Anterior'
      >
        <ChevronLeft className='size-4' />
      </button>
      <button
        onClick={onNext}
        className='border-border/50 bg-card/80 text-muted-foreground hover:text-foreground hover:border-primary/40 flex size-9 items-center justify-center rounded-lg border backdrop-blur-sm transition-colors'
        aria-label='Siguiente'
      >
        <ChevronRight className='size-4' />
      </button>
    </div>
  )
}
