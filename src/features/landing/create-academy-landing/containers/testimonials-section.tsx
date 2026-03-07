import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface TestimonialItem {
  name: string
  role: string
  avatar: string
  text: string
  stats: string
}

export function TestimonialsSection() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = t('createAcademyLanding.testimonials.items', {
    returnObjects: true,
  }) as TestimonialItem[]

  const goTo = (index: number) => {
    setActiveIndex((index + testimonials.length) % testimonials.length)
  }

  const active = testimonials[activeIndex]

  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-12'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            {t('createAcademyLanding.testimonials.eyebrow')}
          </span>
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.testimonials.title')}
          </h2>
          <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
            {t('createAcademyLanding.testimonials.subtitle')}
          </p>
        </div>

        <div className='relative max-w-3xl mx-auto w-full'>
          <div className='relative rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-8 sm:p-10 overflow-hidden'>
            <Quote className='absolute top-6 right-6 size-20 text-primary/5' aria-hidden='true' />

            <div className='relative z-10 flex flex-col gap-6'>
              <div className='flex gap-1'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className='size-4 fill-amber-400 text-amber-400' />
                ))}
              </div>

              <blockquote className='text-base sm:text-lg text-foreground/90 leading-relaxed font-medium min-h-[80px]'>
                {`"${active.text}"`}
              </blockquote>

              <div className='flex items-center justify-between pt-4 border-t border-border/30'>
                <div className='flex items-center gap-3'>
                  <div
                    className='flex items-center justify-center size-11 rounded-full bg-primary/10 border border-primary/20 text-sm font-bold text-primary'
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {active.avatar}
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold text-foreground'>{active.name}</span>
                    <span className='text-xs text-muted-foreground'>{active.role}</span>
                  </div>
                </div>
                <span className='hidden sm:inline text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full'>
                  {active.stats}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className='flex items-center justify-center gap-4 mt-6'>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className='flex items-center justify-center size-9 rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'
              aria-label={t('createAcademyLanding.testimonials.prev')}
            >
              <ChevronLeft className='size-4' />
            </button>

            <div className='flex items-center gap-2'>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === activeIndex
                      ? 'w-6 h-2 bg-primary'
                      : 'size-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  )}
                  aria-label={t('createAcademyLanding.testimonials.dot', { index: i + 1 })}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(activeIndex + 1)}
              className='flex items-center justify-center size-9 rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'
              aria-label={t('createAcademyLanding.testimonials.next')}
            >
              <ChevronRight className='size-4' />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
