/**
 * FeaturedCarousel
 * Generic full-featured carousel extracted from dashboard_carousel reference project.
 * Accepts any array of pre-rendered card nodes per slide; handles auto-advance,
 * progress bar, pause/play, prev/next and dot indicators.
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Pause,
  Play,
} from 'lucide-react'
import { cn } from '@/lib/utils'

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
        <div className='border-border/60 bg-card h-[320px] animate-pulse rounded-xl border' />
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
                className='border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 flex size-8 items-center justify-center rounded-lg border transition-colors'
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
              className='border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 flex size-8 items-center justify-center rounded-lg border transition-colors'
              aria-label='Slide anterior'
            >
              <ChevronLeft className='size-4' />
            </button>
            <button
              onClick={goNext}
              className='border-border/60 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 flex size-8 items-center justify-center rounded-lg border transition-colors'
              aria-label='Siguiente slide'
            >
              <ChevronRight className='size-4' />
            </button>
          </div>
        }
      />

      {/* ── Main carousel card ───────────────────────────────────────────── */}
      <div className='border-border/60 bg-card relative overflow-hidden rounded-xl border'>
        {/* Progress indicators (one bar per slide) */}
        {slides.length > 1 && (
          <div className='absolute inset-x-0 top-0 z-20 flex gap-1 px-5 pt-4'>
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className='bg-foreground/10 relative h-1 flex-1 overflow-hidden rounded-full transition-colors'
                aria-label={`Ir a ${s.title}`}
              >
                {i < activeIndex && (
                  <span className='bg-primary absolute inset-0 rounded-full' />
                )}
                {i === activeIndex && (
                  <span
                    className='bg-primary absolute inset-y-0 left-0 rounded-full transition-[width] duration-100 ease-linear'
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
            'relative z-10 flex h-full flex-col transition-all duration-280 lg:flex-row',
            isTransitioning
              ? 'translate-y-2 opacity-0'
              : 'translate-y-0 opacity-100'
          )}
        >
          {/* Left panel */}
          <div className='flex flex-col justify-center gap-4 p-6 pt-10 lg:w-[320px] lg:shrink-0'>
            <div className='flex flex-col gap-0.5'>
              <span
                className={cn(
                  'text-foreground text-lg leading-tight font-bold'
                )}
              >
                {slide.title}
              </span>
              {slide.meta && (
                <span className='text-muted-foreground text-xs'>
                  {slide.meta}
                </span>
              )}
            </div>

            {slide.tagline && (
              <p className='text-foreground/80 text-[13px] leading-snug font-semibold'>
                {slide.tagline}
              </p>
            )}

            {slide.description && (
              <p className='text-muted-foreground text-xs leading-relaxed'>
                {slide.description}
              </p>
            )}

            {viewAllTo && (
              <Link
                to={viewAllTo as any}
                className='text-primary hover:text-primary/80 group/link mt-1 flex w-fit items-center gap-1.5 text-xs font-medium transition-colors'
              >
                {viewAllLabel}
                <ArrowRight className='size-3.5 transition-transform group-hover/link:translate-x-0.5' />
              </Link>
            )}
          </div>

          {/* Vertical divider */}
          <div className='bg-border/40 my-6 hidden w-px lg:block' />

          {/* Right scroll area */}
          <div className='relative flex-1 overflow-hidden px-2 pt-2 pb-6 lg:pt-10'>
            <div
              ref={scrollContainerRef}
              className='flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2'
              style={{ scrollbarWidth: 'none' }}
            >
              {slide.cards.map((card, i) => (
                <div
                  key={i}
                  className='shrink-0 snap-start'
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {card}
                </div>
              ))}
            </div>
            {/* Right fade */}
            <div className='from-card pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l to-transparent' />
          </div>
        </div>
      </div>

      {/* Dot navigation (when few slides) */}
      {slides.length > 1 && slides.length <= 8 && (
        <div className='mt-1 flex justify-center gap-1.5'>
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeIndex
                  ? 'bg-primary h-1.5 w-5'
                  : 'bg-foreground/20 hover:bg-foreground/40 h-1.5 w-1.5'
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
        <h2 className='text-foreground text-base font-semibold'>{title}</h2>
        {description && (
          <p className='text-muted-foreground text-xs'>{description}</p>
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
