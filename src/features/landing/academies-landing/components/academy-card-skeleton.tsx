import { Skeleton } from '@/components/ui/skeleton'

export function AcademyCardSkeleton() {
  return (
    <div className='flex flex-col rounded-xl border border-border/40 bg-secondary/20 overflow-hidden'>
      <div className='h-1.5 w-full bg-muted/50' />
      <div className='flex flex-col gap-3 p-5'>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-10 rounded-xl shrink-0' />
          <div className='flex flex-col gap-1.5 flex-1'>
            <Skeleton className='h-3.5 w-3/4' />
            <Skeleton className='h-2.5 w-1/2' />
          </div>
        </div>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-2/3' />
        <Skeleton className='h-3 w-1/3' />
        <div className='flex gap-4 pt-2 border-t border-border/20'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-16' />
        </div>
        <Skeleton className='h-8 w-full mt-1' />
      </div>
    </div>
  )
}
