import { useEffect, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { statsService } from '@/services'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { Particles } from '@/components/ui/particles'
import { Navbar } from '@/components/common/navbar'

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
    <div className='bg-background flex min-h-screen flex-col'>
      <Particles
        className='pointer-events-none fixed inset-0 z-0'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />
      <Navbar />
      {/* Two-column area below the fixed Navbar */}
      <div className='flex flex-1 pt-16'>
        {/* Left panel - decorative */}
        <div className='relative hidden overflow-hidden lg:flex lg:w-1/2'>
          {/* Content */}
          <div className='relative z-10 flex w-full flex-col justify-between p-10 xl:p-14'>
            {/* Spacer to align center content with the form panel */}
            <div className='h-10' />
            <div
              className={cn(
                'flex max-w-md flex-col gap-8 transition-all duration-700',
                mounted
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-6 opacity-0'
              )}
            >
              <div className='flex flex-col gap-4'>
                <div className='border-primary/20 bg-primary/5 text-primary flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium'>
                  <span className='bg-primary size-1.5 animate-pulse rounded-full' />
                  {side === 'signin'
                    ? t('auth.layout.welcomeBack')
                    : t('auth.layout.joinCommunity')}
                </div>
                <h2
                  className='text-foreground text-3xl leading-tight font-bold tracking-tight text-balance xl:text-4xl'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {side === 'signin'
                    ? t('auth.layout.titleSignin')
                    : t('auth.layout.titleSignup')}
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
                  {
                    id: 'students',
                    label: platformStats
                      ? t('auth.layout.statsStudents', {
                          n: platformStats.total_students.toLocaleString(),
                        })
                      : '...',
                    delay: 'delay-100',
                  },
                  {
                    id: 'courses',
                    label: platformStats
                      ? t('auth.layout.statsCourses', {
                          n: platformStats.total_courses.toLocaleString(),
                        })
                      : '...',
                    delay: 'delay-200',
                  },
                  {
                    id: 'academies',
                    label: platformStats
                      ? t('auth.layout.statsAcademies', {
                          n: platformStats.total_academies.toLocaleString(),
                        })
                      : '...',
                    delay: 'delay-300',
                  },
                ].map((stat) => (
                  <span
                    key={stat.id}
                    className={cn(
                      'bg-secondary/60 border-border/40 text-secondary-foreground rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-500',
                      mounted
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-3 opacity-0',
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
                'relative transition-all delay-300 duration-700',
                mounted
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              )}
            >
              <div className='bg-card/50 border-border/30 rounded-2xl border p-5 backdrop-blur-sm'>
                <div className='relative min-h-[80px] overflow-hidden'>
                  {testimonials.map((testimonial, i) => (
                    <div
                      key={i}
                      className={cn(
                        'absolute inset-0 transition-all duration-500',
                        i === testimonialIndex
                          ? 'translate-x-0 opacity-100'
                          : 'pointer-events-none translate-x-8 opacity-0'
                      )}
                    >
                      <p className='text-foreground/80 text-sm leading-relaxed italic'>
                        {`"${testimonial.quote}"`}
                      </p>
                      <div className='mt-3 flex items-center gap-2'>
                        <div className='bg-primary/20 text-primary flex size-7 items-center justify-center rounded-full text-xs font-bold'>
                          {testimonial.author[0]}
                        </div>
                        <div>
                          <span className='text-foreground text-xs font-semibold'>
                            {testimonial.author}
                          </span>
                          <span className='text-muted-foreground ml-2 text-xs'>
                            {testimonial.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Dots */}
                <div className='mt-4 flex items-center gap-1.5'>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      className={cn(
                        'h-1 rounded-full transition-all duration-300',
                        i === testimonialIndex
                          ? 'bg-primary w-5'
                          : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5'
                      )}
                      aria-label={t('auth.layout.testimonialDot', {
                        index: i + 1,
                      })}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - form */}
        <div className='relative flex flex-1 items-center justify-center px-4 py-8 sm:px-8'>
          <div
            className={cn(
              'w-full max-w-[420px] transition-all delay-150 duration-700',
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            )}
          >
            {children}
          </div>
        </div>
      </div>
      {/* end two-column area */}
    </div>
  )
}
