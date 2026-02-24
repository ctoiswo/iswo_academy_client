import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, Rocket, DollarSign, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const highlights = [
  { icon: DollarSign, text: 'Monetiza tu experiencia' },
  { icon: Users, text: 'Llega a miles de estudiantes' },
  { icon: TrendingUp, text: 'Crece sin limites' },
]

const rotatingPhrases = [
  'tu experiencia',
  'tus habilidades',
  'tu conocimiento',
  'tu pasion',
]

export function AcademyHero() {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setPhraseIndex((p) => (p + 1) % rotatingPhrases.length)
        setIsAnimating(false)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className='relative min-h-[90vh] flex items-center justify-center overflow-hidden'>
      <div className='pointer-events-none absolute inset-0'>
        <div
          className='absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className='absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20 blur-[160px] rounded-full bg-primary' />
        <div className='absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] opacity-10 blur-[120px] rounded-full bg-indigo-400' />
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16 flex flex-col items-center gap-12'>
        {/* Badge */}
        <div className='flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium'>
          <Rocket className='size-3.5' />
          Para creadores y expertos
        </div>

        {/* Headline */}
        <div className='flex flex-col items-center gap-6 text-center max-w-4xl'>
          <h1
            className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1] text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Convierte{' '}
            <span className='relative inline-block'>
              <span
                className={cn(
                  'text-primary transition-all duration-300',
                  isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
                )}
              >
                {rotatingPhrases[phraseIndex]}
              </span>
              <span className='absolute bottom-0 left-0 right-0 h-[3px] bg-primary/40 rounded-full' />
            </span>
            {' '}en una academia
          </h1>
          <p className='text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl'>
            Crea tu propia academia, sube cursos ilimitados, gestiona estudiantes y genera ingresos.
            Todo con la infraestructura de ISWO Academy detras.
          </p>
        </div>

        {/* CTAs */}
        <div className='flex flex-col sm:flex-row items-center gap-4'>
          <a href='#precios'>
            <Button
              size='lg'
              className='h-12 px-8 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_rgba(99,102,241,0.25)] hover:shadow-[0_0_32px_rgba(99,102,241,0.35)] transition-all duration-300'
            >
              Ver planes y precios
              <ArrowRight className='size-4 ml-2' />
            </Button>
          </a>
          <Link to='/academies'>
            <Button
              variant='outline'
              size='lg'
              className='h-12 px-8 text-sm font-semibold border-border/60 text-foreground hover:bg-secondary/40 hover:border-primary/40 transition-all duration-300'
            >
              Explorar academias
            </Button>
          </Link>
        </div>

        {/* Highlights */}
        <div className='flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-8 border-t border-border/20 w-full max-w-lg'>
          {highlights.map((h) => {
            const Icon = h.icon
            return (
              <div key={h.text} className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Icon className='size-4 text-primary/70' />
                <span>{h.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
