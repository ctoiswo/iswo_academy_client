import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface HeroHeadlineProps {
  wordIndex: number
  isAnimating: boolean
}

export function HeroHeadline({ wordIndex, isAnimating }: HeroHeadlineProps) {
  const { t } = useTranslation()
  const rotatingWords = t('pages.home.hero.rotatingWords', {
    returnObjects: true,
  }) as string[]

  return (
    <div className='flex max-w-4xl flex-col items-center gap-6 text-center'>
      <h1
        className='text-foreground text-4xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl'
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('pages.home.hero.headline')}{' '}
        <span className='relative inline-block'>
          <span
            className={cn(
              'text-primary transition-all duration-300',
              isAnimating
                ? 'translate-y-3 opacity-0'
                : 'translate-y-0 opacity-100'
            )}
          >
            {rotatingWords[wordIndex]}
          </span>
          <span className='bg-primary/40 absolute right-0 bottom-0 left-0 h-[3px] rounded-full' />
        </span>{' '}
        {t('pages.home.hero.headlineSuffix')}
      </h1>
      <p className='text-muted-foreground max-w-2xl text-base leading-relaxed sm:text-lg'>
        {t('pages.home.hero.subtitle')}
      </p>
    </div>
  )
}
