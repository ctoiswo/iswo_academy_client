import { useRef, useEffect, useState } from 'react'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CoursesFilterProps } from '@/types/pages/home'

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
    categoriesRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  return (
    <div className='relative flex items-center gap-2 mb-10'>
      <SlidersHorizontal className='size-4 text-muted-foreground shrink-0' />

      <div className='relative flex-1 overflow-hidden'>
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-7 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground shadow-sm'
          >
            <ChevronLeft className='size-3.5' />
          </button>
        )}

        <div ref={categoriesRef} className='flex gap-2 overflow-x-auto no-scrollbar py-1'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                'px-4 py-1.5 text-xs font-medium rounded-full border whitespace-nowrap transition-all duration-200',
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
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-7 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground shadow-sm'
          >
            <ChevronRight className='size-3.5' />
          </button>
        )}
      </div>

      <span className='text-xs text-muted-foreground shrink-0'>
        {resultsCount} resultado{resultsCount !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
