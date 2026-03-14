import { Skeleton } from '@/components/ui/skeleton'

export function AcademyCardSkeleton() {
  return (
    <div className='border-border/40 bg-secondary/20 flex flex-col overflow-hidden rounded-xl border'>
      <div className='bg-muted/50 h-1.5 w-full' />
      <div className='flex flex-col gap-3 p-5'>
        <div className='flex items-center gap-3'>
          <Skeleton className='size-10 shrink-0 rounded-xl' />
          <div className='flex flex-1 flex-col gap-1.5'>
            <Skeleton className='h-3.5 w-3/4' />
            <Skeleton className='h-2.5 w-1/2' />
          </div>
        </div>
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-2/3' />
        <Skeleton className='h-3 w-1/3' />
        <div className='border-border/20 flex gap-4 border-t pt-2'>
          <Skeleton className='h-3 w-16' />
          <Skeleton className='h-3 w-16' />
        </div>
        <Skeleton className='mt-1 h-8 w-full' />
      </div>
    </div>
  )
}
