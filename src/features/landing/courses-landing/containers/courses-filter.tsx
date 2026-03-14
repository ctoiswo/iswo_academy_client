import { useRef, useEffect, useState } from 'react'
import type { CoursesFilterProps } from '@/types/pages/home'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CoursesFilter({
  categories,
  activeCategory,
  onCategoryChange,
  resultsCount,
}: CoursesFilterProps) {
  const categoriesRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = () => {
    if (!categoriesRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4)
  }

  useEffect(() => {
    checkScroll()
    const el = categoriesRef.current
    el?.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el?.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!categoriesRef.current) return
    categoriesRef.current.scrollBy({
      left: dir === 'left' ? -200 : 200,
      behavior: 'smooth',
    })
  }

  return (
    <div className='relative mb-10 flex items-center gap-2'>
      <SlidersHorizontal className='text-muted-foreground size-4 shrink-0' />

      <div className='relative flex-1 overflow-hidden'>
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className='bg-background/80 border-border/50 text-muted-foreground hover:text-foreground absolute top-1/2 left-0 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm'
          >
            <ChevronLeft className='size-3.5' />
          </button>
        )}

        <div
          ref={categoriesRef}
          className='no-scrollbar flex gap-2 overflow-x-auto py-1'
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(99,102,241,0.2)]'
                  : 'border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/40 bg-card/40'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className='bg-background/80 border-border/50 text-muted-foreground hover:text-foreground absolute top-1/2 right-0 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border shadow-sm backdrop-blur-sm'
          >
            <ChevronRight className='size-3.5' />
          </button>
        )}
      </div>

      <span className='text-muted-foreground shrink-0 text-xs'>
        {resultsCount} resultado{resultsCount !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
