import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { buildStatItems } from '@/lib/utils'
import { statsService } from '@/services'
import type { StatItem } from '@/types'
import { HeroBadge } from '../components/hero-badge'
import { HeroHeadline } from '../components/hero-headline'
import { HeroCtas } from '../components/hero-ctas'
import { HeroStatsBar } from '../components/hero-stats-bar'

export function HeroSection() {
  const { t } = useTranslation()
  const rotatingWords = t('pages.home.hero.rotatingWords', { returnObjects: true }) as string[]
  const wordCount = Array.isArray(rotatingWords) ? rotatingWords.length : 4

  const [wordIndex, setWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [statItems, setStatItems] = useState<StatItem[]>([])

  useEffect(() => {
    statsService.getStats().then((data) => {
      setStatItems(buildStatItems(data))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % wordCount)
        setIsAnimating(false)
      }, 300)
    }, 3000)
    return () => clearInterval(interval)
  }, [wordCount])

  return (
    <section className='relative min-h-[90vh] flex items-center justify-center overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4 lg:px-8 pt-24 pb-16 flex flex-col items-center gap-12'>
        <HeroBadge />
        <HeroHeadline wordIndex={wordIndex} isAnimating={isAnimating} />
        <HeroCtas />
        <HeroStatsBar items={statItems} />
      </div>
    </section>
  )
}
