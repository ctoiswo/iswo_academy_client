import { cn } from '@/lib/utils'
import type { CategoryWithVisual } from '@/constants/home-constants'

interface CategoryAmbientGradientsProps {
  categories: CategoryWithVisual[]
  activeIndex: number
  isTransitioning: boolean
}

export function CategoryAmbientGradients({
  categories,
  activeIndex,
  isTransitioning,
}: CategoryAmbientGradientsProps) {
  return (
    <>
      {categories.map((cat, i) => (
        <div
          key={cat.id}
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 bg-gradient-to-br transition-opacity duration-700',
            cat.accentFrom,
            cat.accentTo,
            i === activeIndex && !isTransitioning
              ? 'opacity-[0.055]'
              : 'opacity-0'
          )}
        />
      ))}
    </>
  )
}
