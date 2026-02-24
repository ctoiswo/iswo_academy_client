/**
 * FeaturedCarousel
 * Generic full-featured carousel extracted from dashboard_carousel reference project.
 * Accepts any array of pre-rendered card nodes per slide; handles auto-advance,
 * progress bar, pause/play, prev/next and dot indicators.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Play,
} from 'lucide-react'

/** A single slide: maps to one category with its cards */
export interface CarouselSlide {
  id: string | number
  /** Main label for the left panel (e.g. category name) */
  title: string
  /** Small sub-text next to the icon area, e.g. "5 academias" */
  meta?: string
  /** Short 1-line tagline displayed in bolder text */
  tagline?: string
  /** Longer description rendered below the tagline */
  description?: string
  /** Tailwind gradient start class, e.g. "from-indigo-500" */
  accentFrom: string
  /** Tailwind gradient end class, e.g. "to-indigo-700" */
  accentTo: string
  /** Pre-rendered card nodes shown in the horizontal scroll area */
  cards: React.ReactNode[]
}

interface FeaturedCarouselProps {
  /** Displayed above the carousel as the section heading */
  sectionTitle: string
  sectionDescription?: string
  slides: CarouselSlide[]
  /** If provided, a "View all" link appears */
  viewAllTo?: string
  viewAllLabel?: string
  /** Whether to show skeletal loading state */
  isLoading?: boolean
  /** Auto-advance interval in ms (default 6 000) */
  interval?: number
}

const TICK = 30 // progress update interval (ms)

export function FeaturedCarousel({
  sectionTitle,
  sectionDescription,
  slides,
  viewAllTo,
  viewAllLabel = 'Ver todo',
  isLoading = false,
  interval = 6000,
}: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || slides.length === 0) return
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveIndex(index)
        setProgress(0)
        scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'instant' })
        setTimeout(() => setIsTransitioning(false), 50)
      }, 280)
    },
    [isTransitioning, slides.length]
  )

  const goNext = useCallback(() => {
    goTo((activeIndex + 1) % slides.length)
  }, [activeIndex, goTo, slides.length])

  const goPrev = useCallback(() => {
    goTo((activeIndex - 1 + slides.length) % slides.length)
  }, [activeIndex, goTo, slides.length])

  // Auto-advance + progress ticker
  useEffect(() => {
    if (isPaused || slides.length <= 1) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
      return
    }

    progressRef.current = setInterval(() => {
      setProgress((p) => {
        const next = p + (TICK / interval) * 100
        return next >= 100 ? 100 : next
      })
    }, TICK)

    intervalRef.current = setInterval(goNext, interval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [isPaused, activeIndex, goNext, interval, slides.length])

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <section className='flex flex-col gap-4'>
        <SectionHeader
          title={sectionTitle}
          description={sectionDescription}
          controls={null}
        />
        <div className='h-[320px] animate-pulse rounded-xl border border-border/60 bg-card' />
      </section>
    )
  }

  if (slides.length === 0) return null

  const slide = slides[activeIndex]

  return (
    <section className='flex flex-col gap-4'>
      {/* ── Section header row ───────────────────────────────────────────── */}
      <SectionHeader
        title={sectionTitle}
        description={sectionDescription}
        controls={
          <div className='flex items-center gap-2'>
            {slides.length > 1 && (
              <button
                onClick={() => setIsPaused((p) => !p)}
                className='flex items-center justify-center size-8 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'
                aria-label={isPaused ? 'Reanudar' : 'Pausar'}
              >
                {isPaused ? (
                  <Play className='size-3.5' />
                ) : (
                  <Pause className='size-3.5' />
                )}
              </button>
            )}
            <button
              onClick={goPrev}
              className='flex items-center justify-center size-8 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'
              aria-label='Slide anterior'
            >
              <ChevronLeft className='size-4' />
            </button>
            <button
              onClick={goNext}
              className='flex items-center justify-center size-8 rounded-lg border border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'
              aria-label='Siguiente slide'
            >
              <ChevronRight className='size-4' />
            </button>
          </div>
        }
      />

      {/* ── Main carousel card ───────────────────────────────────────────── */}
      <div className='relative rounded-xl border border-border/60 bg-card overflow-hidden'>
        {/* Progress indicators (one bar per slide) */}
        {slides.length > 1 && (
          <div className='absolute top-0 inset-x-0 z-20 flex gap-1 px-5 pt-4'>
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className='relative flex-1 h-1 rounded-full overflow-hidden bg-foreground/10 transition-colors'
                aria-label={`Ir a ${s.title}`}
              >
                {i < activeIndex && (
                  <span className='absolute inset-0 bg-primary rounded-full' />
                )}
                {i === activeIndex && (
                  <span
                    className='absolute inset-y-0 left-0 bg-primary rounded-full transition-[width] duration-100 ease-linear'
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Gradient tint background */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-[0.07] transition-opacity duration-500',
            slide.accentFrom,
            slide.accentTo,
            isTransitioning && 'opacity-0'
          )}
        />

        {/* Content */}
        <div
          className={cn(
            'relative z-10 flex flex-col lg:flex-row h-full transition-all duration-280',
            isTransitioning
              ? 'opacity-0 translate-y-2'
              : 'opacity-100 translate-y-0'
          )}
        >
          {/* Left panel */}
          <div className='flex flex-col justify-center gap-4 p-6 pt-10 lg:w-[320px] lg:shrink-0'>
            <div className='flex flex-col gap-0.5'>
              <span
                className={cn(
                  'text-lg font-bold text-foreground leading-tight',
                )}
              >
                {slide.title}
              </span>
              {slide.meta && (
                <span className='text-xs text-muted-foreground'>{slide.meta}</span>
              )}
            </div>

            {slide.tagline && (
              <p className='text-[13px] font-semibold text-foreground/80 leading-snug'>
                {slide.tagline}
              </p>
            )}

            {slide.description && (
              <p className='text-xs text-muted-foreground leading-relaxed'>
                {slide.description}
              </p>
            )}

            {viewAllTo && (
              <Link
                to={viewAllTo as any}
                className='flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors mt-1 w-fit group/link'
              >
                {viewAllLabel}
                <ArrowRight className='size-3.5 group-hover/link:translate-x-0.5 transition-transform' />
              </Link>
            )}
          </div>

          {/* Vertical divider */}
          <div className='hidden lg:block w-px bg-border/40 my-6' />

          {/* Right scroll area */}
          <div className='flex-1 relative px-2 pb-6 pt-2 lg:pt-10 overflow-hidden'>
            <div
              ref={scrollContainerRef}
              className='flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory'
              style={{ scrollbarWidth: 'none' }}
            >
              {slide.cards.map((card, i) => (
                <div
                  key={i}
                  className='snap-start shrink-0'
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {card}
                </div>
              ))}
            </div>
            {/* Right fade */}
            <div className='pointer-events-none absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-card to-transparent z-10' />
          </div>
        </div>
      </div>

      {/* Dot navigation (when few slides) */}
      {slides.length > 1 && slides.length <= 8 && (
        <div className='flex justify-center gap-1.5 mt-1'>
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'w-5 h-1.5 bg-primary'
                  : 'w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/40'
              )}
              aria-label={`Ir a ${s.title}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  description,
  controls,
}: {
  title: string
  description?: string
  controls: React.ReactNode
}) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <div className='flex flex-col gap-0.5'>
        <h2 className='text-base font-semibold text-foreground'>{title}</h2>
        {description && (
          <p className='text-xs text-muted-foreground'>{description}</p>
        )}
      </div>
      {controls}
    </div>
  )
}

/** Cycle through a palette of accent gradient classes by index */
export const accentPalette = [
  { from: 'from-indigo-500', to: 'to-indigo-700' },
  { from: 'from-pink-500', to: 'to-rose-700' },
  { from: 'from-emerald-500', to: 'to-teal-700' },
  { from: 'from-sky-500', to: 'to-blue-700' },
  { from: 'from-orange-500', to: 'to-amber-700' },
  { from: 'from-violet-500', to: 'to-purple-700' },
] as const
