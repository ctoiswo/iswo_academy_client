import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface EmptyAcademiesStateProps {
  onClearFilters: () => void
}

export function EmptyAcademiesState({
  onClearFilters,
}: EmptyAcademiesStateProps) {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center justify-center gap-4 py-24 text-center'>
      <div className='bg-muted/50 border-border/40 flex size-16 items-center justify-center rounded-2xl border'>
        <Search className='text-muted-foreground size-7' />
      </div>
      <div className='flex flex-col gap-2'>
        <h3
          className='text-foreground text-lg font-semibold'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('academiesLanding.emptyState.title')}
        </h3>
        <p className='text-muted-foreground max-w-sm text-sm'>
          {t('academiesLanding.emptyState.description')}
        </p>
      </div>
      <Button variant='outline' size='sm' onClick={onClearFilters}>
        {t('academiesLanding.emptyState.clearFilters')}
      </Button>
    </div>
  )
}
