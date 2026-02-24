import { useEffect, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { statsService } from '@/services'
import { Navbar } from '@/components/common/navbar'
import { Particles } from '@/components/ui/particles'
import { useTranslation } from '@/hooks/use-translation'

export function AuthLayout({
  children,
  side,
}: {
  children: React.ReactNode
  side: 'signin' | 'signup'
}) {
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation()

  const { data: platformStats } = useQuery({
    queryKey: ['platform', 'stats'],
    queryFn: () => statsService.getStats(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const testimonials = [
    {
      quote: t('auth.layout.testimonial1.quote'),
      author: t('auth.layout.testimonial1.author'),
      role: t('auth.layout.testimonial1.role'),
    },
    {
      quote: t('auth.layout.testimonial2.quote'),
      author: t('auth.layout.testimonial2.author'),
      role: t('auth.layout.testimonial2.role'),
    },
    {
      quote: t('auth.layout.testimonial3.quote'),
      author: t('auth.layout.testimonial3.author'),
      role: t('auth.layout.testimonial3.role'),
    },
  ]

  const [testimonialIndex, setTestimonialIndex] = useState(0)

  const nextTestimonial = useCallback(() => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [nextTestimonial])

  return (
    <div className='flex min-h-screen bg-background flex-col'>
      <Particles
        className='fixed inset-0 z-0 pointer-events-none'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />
      <Navbar />
      {/* Two-column area below the fixed Navbar */}
      <div className='flex flex-1 pt-16'>
      {/* Left panel - decorative */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden'>
        {/* Content */}
        <div className='relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full'>
            {/* Spacer to align center content with the form panel */}
            <div className='h-10' />
          <div
            className={cn(
              'flex flex-col gap-8 max-w-md transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            )}
          >
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium w-fit'>
                <span className='size-1.5 rounded-full bg-primary animate-pulse' />
                {side === 'signin' ? t('auth.layout.welcomeBack') : t('auth.layout.joinCommunity')}
              </div>
              <h2
                className='text-3xl xl:text-4xl font-bold text-foreground tracking-tight leading-tight text-balance'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {side === 'signin' ? t('auth.layout.titleSignin') : t('auth.layout.titleSignup')}
              </h2>
              <p className='text-muted-foreground leading-relaxed'>
                {side === 'signin'
                  ? t('auth.layout.descSignin')
                  : t('auth.layout.descSignup')}
              </p>
            </div>

            {/* Stat pills */}
            <div className='flex flex-wrap gap-3'>
              {[
                { id: 'students', label: platformStats ? t('auth.layout.statsStudents', { n: platformStats.total_students.toLocaleString() }) : '...', delay: 'delay-100' },
                { id: 'courses', label: platformStats ? t('auth.layout.statsCourses', { n: platformStats.total_courses.toLocaleString() }) : '...', delay: 'delay-200' },
                { id: 'academies', label: platformStats ? t('auth.layout.statsAcademies', { n: platformStats.total_academies.toLocaleString() }) : '...', delay: 'delay-300' },
              ].map((stat) => (
                <span
                  key={stat.id}
                  className={cn(
                    'px-3 py-1.5 rounded-lg bg-secondary/60 border border-border/40 text-xs font-medium text-secondary-foreground transition-all duration-500',
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
                    stat.delay
                  )}
                >
                  {stat.label}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div
            className={cn(
              'relative transition-all duration-700 delay-300',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <div className='p-5 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm'>
              <div className='relative overflow-hidden min-h-[80px]'>
                {testimonials.map((testimonial, i) => (
                  <div
                    key={i}
                    className={cn(
                      'transition-all duration-500 absolute inset-0',
                      i === testimonialIndex
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-8 pointer-events-none'
                    )}
                  >
                    <p className='text-sm text-foreground/80 italic leading-relaxed'>
                      {`"${testimonial.quote}"`}
                    </p>
                    <div className='flex items-center gap-2 mt-3'>
                      <div className='size-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary'>
                        {testimonial.author[0]}
                      </div>
                      <div>
                        <span className='text-xs font-semibold text-foreground'>{testimonial.author}</span>
                        <span className='text-xs text-muted-foreground ml-2'>{testimonial.role}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Dots */}
              <div className='flex items-center gap-1.5 mt-4'>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={cn(
                      'h-1 rounded-full transition-all duration-300',
                      i === testimonialIndex
                        ? 'w-5 bg-primary'
                        : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    )}
                    aria-label={t('auth.layout.testimonialDot', { index: i + 1 })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className='flex-1 flex items-center justify-center px-4 py-8 sm:px-8 relative'>
        <div
          className={cn(
            'w-full max-w-[420px] transition-all duration-700 delay-150',
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          {children}
        </div>
      </div>
      </div>{/* end two-column area */}
    </div>
  )
}
