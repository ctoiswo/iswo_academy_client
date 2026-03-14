import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { featureKeys } from '@/constants/home-constants'

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section className='relative py-24'>
      <div className='mx-auto flex max-w-7xl flex-col gap-12 px-4 lg:px-8'>
        {/* Header */}
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
            {t('pages.home.features.eyebrow')}
          </span>
          <h2
            className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('pages.home.features.title')}
          </h2>
          <p className='text-muted-foreground max-w-lg text-sm leading-relaxed'>
            {t('pages.home.features.subtitle')}
          </p>
        </div>

        {/* Feature grid */}
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {featureKeys.map(({ icon: Icon, key, accent }) => (
            <article
              key={key}
              className='group border-border/40 bg-card/40 hover:border-primary/30 hover:bg-card/70 relative flex flex-col gap-4 rounded-xl border p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_24px_rgba(99,102,241,0.06)]'
            >
              <div
                className={cn(
                  'flex size-11 items-center justify-center rounded-xl bg-gradient-to-br',
                  accent
                )}
              >
                <Icon className='text-foreground size-5' />
              </div>
              <h3
                className='text-foreground text-base font-semibold'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t(`pages.home.features.items.${key}.title`)}
              </h3>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {t(`pages.home.features.items.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
