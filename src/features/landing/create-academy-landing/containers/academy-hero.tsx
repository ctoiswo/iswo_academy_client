import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Rocket, DollarSign, Users, TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const highlightIcons = [DollarSign, Users, TrendingUp]

export function AcademyHero() {
  const { t } = useTranslation()
  const rotatingPhrases = t('createAcademyLanding.hero.headlineRotating', {
    returnObjects: true,
  }) as string[]
  const highlights = [
    {
      icon: highlightIcons[0],
      text: t('createAcademyLanding.hero.highlight1'),
    },
    {
      icon: highlightIcons[1],
      text: t('createAcademyLanding.hero.highlight2'),
    },
    {
      icon: highlightIcons[2],
      text: t('createAcademyLanding.hero.highlight3'),
    },
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
    <section className='relative flex min-h-[90vh] items-center justify-center overflow-hidden'>
      <div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 pt-24 pb-16 lg:px-8'>
        {/* Badge */}
        <div className='border-primary/20 bg-primary/5 text-primary flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium'>
          <Rocket className='size-3.5' />
          {t('createAcademyLanding.hero.badge')}
        </div>

        {/* Headline */}
        <div className='flex max-w-4xl flex-col items-center gap-6 text-center'>
          <h1
            className='text-foreground text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.hero.headline')}{' '}
            <span className='relative inline-block'>
              <span
                className={cn(
                  'text-primary transition-all duration-300',
                  isAnimating
                    ? 'translate-y-3 opacity-0'
                    : 'translate-y-0 opacity-100'
                )}
              >
                {rotatingPhrases[phraseIndex]}
              </span>
              <span className='bg-primary/40 absolute right-0 bottom-0 left-0 h-[3px] rounded-full' />
            </span>{' '}
            {t('createAcademyLanding.hero.headlineSuffix')}
          </h1>
          <p className='text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg'>
            {t('createAcademyLanding.hero.subtitle')}
          </p>
        </div>

        {/* CTAs */}
        <div className='flex flex-col items-center gap-4 sm:flex-row'>
          <a href='#precios'>
            <Button
              size='lg'
              className='bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-sm font-semibold shadow-[0_0_24px_rgba(99,102,241,0.25)] transition-all duration-300 hover:shadow-[0_0_32px_rgba(99,102,241,0.35)]'
            >
              {t('createAcademyLanding.hero.ctaPricing')}
              <ArrowRight className='ml-2 size-4' />
            </Button>
          </a>
          <Link to='/academies'>
            <Button
              variant='outline'
              size='lg'
              className='border-border/60 text-foreground hover:bg-secondary/40 hover:border-primary/40 h-12 px-8 text-sm font-semibold transition-all duration-300'
            >
              {t('createAcademyLanding.hero.ctaExplore')}
            </Button>
          </Link>
        </div>

        {/* Highlights */}
        <div className='border-border/20 flex w-full max-w-lg flex-wrap items-center justify-center gap-6 border-t pt-8 sm:gap-10'>
          {highlights.map((h) => {
            const Icon = h.icon
            return (
              <div
                key={h.text}
                className='text-muted-foreground flex items-center gap-2 text-sm'
              >
                <Icon className='text-primary/70 size-4' />
                <span>{h.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
