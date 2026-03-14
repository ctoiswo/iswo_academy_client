import { useTranslation } from 'react-i18next'

export function CtaContent() {
  const { t } = useTranslation()
  return (
    <div className='flex max-w-2xl flex-col gap-4'>
      <h2
        className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('pages.home.cta.title')}
      </h2>
      <p className='text-muted-foreground text-base leading-relaxed'>
        {t('pages.home.cta.subtitle')}
      </p>
    </div>
  )
}
