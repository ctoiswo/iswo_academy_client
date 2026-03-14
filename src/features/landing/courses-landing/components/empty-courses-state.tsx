import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyCoursesStateProps {
  onClearFilters: () => void
}

export function EmptyCoursesState({ onClearFilters }: EmptyCoursesStateProps) {
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
          Sin resultados
        </h3>
        <p className='text-muted-foreground max-w-sm text-sm'>
          No encontramos cursos con ese criterio. Intenta con otra palabra clave
          o categoria.
        </p>
      </div>
      <Button variant='outline' size='sm' onClick={onClearFilters}>
        Limpiar filtros
      </Button>
    </div>
  )
}
