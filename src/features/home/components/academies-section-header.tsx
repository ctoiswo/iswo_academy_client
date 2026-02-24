import { useTranslation } from 'react-i18next'

export function AcademiesSectionHeader() {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center gap-4 text-center'>
      <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
        {t('pages.home.academies.eyebrow')}
      </span>
      <h2
        className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('pages.home.academies.title')}
      </h2>
      <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
        {t('pages.home.academies.subtitle')}
      </p>
    </div>
  )
}
