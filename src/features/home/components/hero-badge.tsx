import { useTranslation } from 'react-i18next'

export function HeroBadge() {
  const { t } = useTranslation()
  return (
    <div className='flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium'>
      <span className='size-1.5 rounded-full bg-primary animate-pulse' />
      {t('pages.home.hero.badge')}
    </div>
  )
}
