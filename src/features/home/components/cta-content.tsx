import { useTranslation } from 'react-i18next'

export function CtaContent() {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col gap-4 max-w-2xl'>
      <h2
        className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('pages.home.cta.title')}
      </h2>
      <p className='text-base text-muted-foreground leading-relaxed'>
        {t('pages.home.cta.subtitle')}
      </p>
    </div>
  )
}
