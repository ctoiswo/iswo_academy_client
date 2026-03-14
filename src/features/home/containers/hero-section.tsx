import { useEffect, useState } from 'react'
import { statsService } from '@/services'
import type { StatItem } from '@/types'
import { useTranslation } from 'react-i18next'
import { buildStatItems } from '@/lib/utils'
import { HeroBadge } from '../components/hero-badge'
import { HeroCtas } from '../components/hero-ctas'
import { HeroHeadline } from '../components/hero-headline'
import { HeroStatsBar } from '../components/hero-stats-bar'

export function HeroSection() {
  const { t } = useTranslation()
  const rotatingWords = t('pages.home.hero.rotatingWords', {
    returnObjects: true,
  }) as string[]
  const wordCount = Array.isArray(rotatingWords) ? rotatingWords.length : 4

  const [wordIndex, setWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [statItems, setStatItems] = useState<StatItem[]>([])

  useEffect(() => {
    statsService
      .getStats()
      .then((data) => {
        setStatItems(buildStatItems(data))
      })
      .catch(() => {})
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
    <section className='relative flex min-h-[90vh] items-center justify-center overflow-hidden'>
      <div className='relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 pt-24 pb-16 lg:px-8'>
        <HeroBadge />
        <HeroHeadline wordIndex={wordIndex} isAnimating={isAnimating} />
        <HeroCtas />
        <HeroStatsBar items={statItems} />
      </div>
    </section>
  )
}
