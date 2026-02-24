import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { featureKeys } from '@/constants/home-constants'


export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section className='relative py-24'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-12'>
        {/* Header */}
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            {t('pages.home.features.eyebrow')}
          </span>
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('pages.home.features.title')}
          </h2>
          <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
            {t('pages.home.features.subtitle')}
          </p>
        </div>

        {/* Feature grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {featureKeys.map(({ icon: Icon, key, accent }) => (
            <article
              key={key}
              className='group relative flex flex-col gap-4 p-6 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/70 hover:shadow-[0_0_24px_rgba(99,102,241,0.06)]'
            >
              <div className={cn('flex items-center justify-center size-11 rounded-xl bg-gradient-to-br', accent)}>
                <Icon className='size-5 text-foreground' />
              </div>
              <h3
                className='text-base font-semibold text-foreground'
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {t(`pages.home.features.items.${key}.title`)}
              </h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {t(`pages.home.features.items.${key}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
