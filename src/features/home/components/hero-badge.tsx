import { useTranslation } from 'react-i18next'

export function HeroBadge() {
  const { t } = useTranslation()
  return (
    <div className='border-primary/20 bg-primary/5 text-primary flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium'>
      <span className='bg-primary size-1.5 animate-pulse rounded-full' />
      {t('pages.home.hero.badge')}
    </div>
  )
}
