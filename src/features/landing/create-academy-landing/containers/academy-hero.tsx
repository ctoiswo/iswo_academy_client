import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ArrowRight, Rocket, DollarSign, Users, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const highlightIcons = [DollarSign, Users, TrendingUp]

export function AcademyHero() {
  const { t } = useTranslation()
  const rotatingPhrases = t('createAcademyLanding.hero.headlineRotating', {
    returnObjects: true,
  }) as string[]
  const highlights = [
    { icon: highlightIcons[0], text: t('createAcademyLanding.hero.highlight1') },
    { icon: highlightIcons[1], text: t('createAcademyLanding.hero.highlight2') },
    { icon: highlightIcons[2], text: t('createAcademyLanding.hero.highlight3') },
  ]

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
  }, [rotatingPhrases.length])

  return (
    <section className='relative min-h-[90vh] flex items-center justify-center overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16 flex flex-col items-center gap-12'>
        {/* Badge */}
        <div className='flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium'>
          <Rocket className='size-3.5' />
          {t('createAcademyLanding.hero.badge')}
        </div>

        {/* Headline */}
        <div className='flex flex-col items-center gap-6 text-center max-w-4xl'>
          <h1
            className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1] text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.hero.headline')}{' '}
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
            {' '}{t('createAcademyLanding.hero.headlineSuffix')}
          </h1>
          <p className='text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl'>
            {t('createAcademyLanding.hero.subtitle')}
          </p>
        </div>

        {/* CTAs */}
        <div className='flex flex-col sm:flex-row items-center gap-4'>
          <a href='#precios'>
            <Button
              size='lg'
              className='h-12 px-8 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_24px_rgba(99,102,241,0.25)] hover:shadow-[0_0_32px_rgba(99,102,241,0.35)] transition-all duration-300'
            >
              {t('createAcademyLanding.hero.ctaPricing')}
              <ArrowRight className='size-4 ml-2' />
            </Button>
          </a>
          <Link to='/academies'>
            <Button
              variant='outline'
              size='lg'
              className='h-12 px-8 text-sm font-semibold border-border/60 text-foreground hover:bg-secondary/40 hover:border-primary/40 transition-all duration-300'
            >
              {t('createAcademyLanding.hero.ctaExplore')}
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
