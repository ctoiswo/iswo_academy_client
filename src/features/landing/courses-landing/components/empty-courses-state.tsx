import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyCoursesStateProps {
  onClearFilters: () => void
}

export function EmptyCoursesState({ onClearFilters }: EmptyCoursesStateProps) {
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
          Sin resultados
        </h3>
        <p className='text-sm text-muted-foreground max-w-sm'>
          No encontramos cursos con ese criterio. Intenta con otra palabra clave o categoria.
        </p>
      </div>
      <Button variant='outline' size='sm' onClick={onClearFilters}>
        Limpiar filtros
      </Button>
    </div>
  )
}
