import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselNavArrowsProps {
  onPrev: () => void
  onNext: () => void
}

export function CarouselNavArrows({ onPrev, onNext }: CarouselNavArrowsProps) {
  return (
    <div className='absolute bottom-4 right-6 flex gap-2 z-20'>
      <button
        onClick={onPrev}
        className='flex items-center justify-center size-9 rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'
        aria-label='Anterior'
      >
        <ChevronLeft className='size-4' />
      </button>
      <button
        onClick={onNext}
        className='flex items-center justify-center size-9 rounded-lg border border-border/50 bg-card/80 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'
        aria-label='Siguiente'
      >
        <ChevronRight className='size-4' />
      </button>
    </div>
  )
}
