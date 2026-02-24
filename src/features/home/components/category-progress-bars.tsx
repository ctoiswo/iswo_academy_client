import { cn } from '@/lib/utils'
import type { CategoryWithVisual } from '@/constants/home-constants'

interface CategoryProgressBarsProps {
  categories: CategoryWithVisual[]
  activeIndex: number
  progress: number
  onGoTo: (index: number) => void
}

export function CategoryProgressBars({
  categories,
  activeIndex,
  progress,
  onGoTo,
}: CategoryProgressBarsProps) {
  return (
    <div className='relative z-10 flex gap-1.5 px-6 pt-5'>
      {categories.map((cat, i) => (
        <button
          key={cat.id}
          onClick={() => onGoTo(i)}
          className='relative flex-1 h-[3px] rounded-full overflow-hidden bg-foreground/[0.08]'
          aria-label={`Ir a ${cat.name}`}
        >
          {i < activeIndex && (
            <div
              className={cn(
                'absolute inset-0 rounded-full bg-gradient-to-r',
                cat.accentFrom,
                cat.accentTo
              )}
            />
          )}
          {i === activeIndex && (
            <div
              className={cn(
                'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r transition-[width] duration-100 ease-linear',
                cat.accentFrom,
                cat.accentTo
              )}
              style={{ width: `${progress}%` }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
