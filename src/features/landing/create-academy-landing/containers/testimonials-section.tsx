import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

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
    <section className='relative overflow-hidden py-24'>
      <div className='mx-auto flex max-w-7xl flex-col gap-12 px-4 lg:px-8'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
            {t('createAcademyLanding.testimonials.eyebrow')}
          </span>
          <h2
            className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.testimonials.title')}
          </h2>
          <p className='text-muted-foreground max-w-lg text-sm leading-relaxed'>
            {t('createAcademyLanding.testimonials.subtitle')}
          </p>
        </div>

        <div className='relative mx-auto w-full max-w-3xl'>
          <div className='border-border/40 bg-card/60 relative overflow-hidden rounded-2xl border p-8 backdrop-blur-sm sm:p-10'>
            <Quote
              className='text-primary/5 absolute top-6 right-6 size-20'
              aria-hidden='true'
            />

            <div className='relative z-10 flex flex-col gap-6'>
              <div className='flex gap-1'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className='size-4 fill-amber-400 text-amber-400'
                  />
                ))}
              </div>

              <blockquote className='text-foreground/90 min-h-[80px] text-base leading-relaxed font-medium sm:text-lg'>
                {`"${active.text}"`}
              </blockquote>

              <div className='border-border/30 flex items-center justify-between border-t pt-4'>
                <div className='flex items-center gap-3'>
                  <div
                    className='bg-primary/10 border-primary/20 text-primary flex size-11 items-center justify-center rounded-full border text-sm font-bold'
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {active.avatar}
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-foreground text-sm font-semibold'>
                      {active.name}
                    </span>
                    <span className='text-muted-foreground text-xs'>
                      {active.role}
                    </span>
                  </div>
                </div>
                <span className='text-primary bg-primary/10 hidden rounded-full px-3 py-1 text-xs font-medium sm:inline'>
                  {active.stats}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className='mt-6 flex items-center justify-center gap-4'>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className='border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 flex size-9 items-center justify-center rounded-lg border transition-colors'
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
                      ? 'bg-primary h-2 w-6'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 size-2'
                  )}
                  aria-label={t('createAcademyLanding.testimonials.dot', {
                    index: i + 1,
                  })}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(activeIndex + 1)}
              className='border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 flex size-9 items-center justify-center rounded-lg border transition-colors'
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
