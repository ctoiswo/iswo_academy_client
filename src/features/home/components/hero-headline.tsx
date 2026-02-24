import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface HeroHeadlineProps {
  wordIndex: number
  isAnimating: boolean
}

export function HeroHeadline({ wordIndex, isAnimating }: HeroHeadlineProps) {
  const { t } = useTranslation()
  const rotatingWords = t('pages.home.hero.rotatingWords', { returnObjects: true }) as string[]

  return (
    <div className='flex flex-col items-center gap-6 text-center max-w-4xl'>
      <h1
        className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1] text-balance'
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('pages.home.hero.headline')}{' '}
        <span className='relative inline-block'>
          <span
            className={cn(
              'text-primary transition-all duration-300',
              isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
            )}
          >
            {rotatingWords[wordIndex]}
          </span>
          <span className='absolute bottom-0 left-0 right-0 h-[3px] bg-primary/40 rounded-full' />
        </span>
        {' '}{t('pages.home.hero.headlineSuffix')}
      </h1>
      <p className='text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl'>
        {t('pages.home.hero.subtitle')}
      </p>
    </div>
  )
}
