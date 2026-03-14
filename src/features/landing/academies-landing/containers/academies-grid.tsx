import { Loader2 } from 'lucide-react'
import { AcademyCard } from '../components/academy-card'
import { AcademyCardSkeleton } from '../components/academy-card-skeleton'
import { EmptyAcademiesState } from '../components/empty-academies-state'
import type { AcademiesGridProps } from '@/types/pages/academies-landing'

export function AcademiesGrid({
  academies,
  isLoading,
  isFetchingNextPage,
  sentinelRef,
  onClearFilters,
}: AcademiesGridProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {Array.from({ length: 8 }).map((_, i) => (
          <AcademyCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (academies.length === 0) {
    return <EmptyAcademiesState onClearFilters={onClearFilters} />
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {academies.map((academy, i) => (
          <AcademyCard key={academy.id} academy={academy} index={i} />
        ))}
      </div>

      {/* Intersection sentinel — triggers loading of the next page */}
      <div ref={sentinelRef} className='h-px' />

      {isFetchingNextPage && (
        <div className='flex justify-center py-8'>
          <Loader2 className='size-6 animate-spin text-muted-foreground' />
        </div>
      )}
    </>
  )
}
