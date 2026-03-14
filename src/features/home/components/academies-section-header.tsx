import { useTranslation } from 'react-i18next'

export function AcademiesSectionHeader() {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center gap-4 text-center'>
      <span className='text-primary text-xs font-semibold tracking-widest uppercase'>
        {t('pages.home.academies.eyebrow')}
      </span>
      <h2
        className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-4xl'
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {t('pages.home.academies.title')}
      </h2>
      <p className='text-muted-foreground max-w-lg text-sm leading-relaxed'>
        {t('pages.home.academies.subtitle')}
      </p>
    </div>
  )
}
