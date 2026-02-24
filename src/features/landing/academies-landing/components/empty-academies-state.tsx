import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface EmptyAcademiesStateProps {
  onClearFilters: () => void
}

export function EmptyAcademiesState({ onClearFilters }: EmptyAcademiesStateProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center justify-center gap-4 py-24 text-center'>
      <div className='flex items-center justify-center size-16 rounded-2xl bg-muted/50 border border-border/40'>
        <Search className='size-7 text-muted-foreground' />
      </div>
      <div className='flex flex-col gap-2'>
        <h3
          className='text-lg font-semibold text-foreground'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('academiesLanding.emptyState.title')}
        </h3>
        <p className='text-sm text-muted-foreground max-w-sm'>
          {t('academiesLanding.emptyState.description')}
        </p>
      </div>
      <Button variant='outline' size='sm' onClick={onClearFilters}>
        {t('academiesLanding.emptyState.clearFilters')}
      </Button>
    </div>
  )
}
