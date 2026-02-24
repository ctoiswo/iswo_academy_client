import { Skeleton } from '@/components/ui/skeleton'

export function CourseCardSkeleton() {
  return (
    <div className='flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden'>
      <Skeleton className='h-40 w-full' />
      <div className='flex flex-col gap-3 px-5 pb-5 pt-4'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-2/3' />
        <Skeleton className='h-8 w-full mt-2' />
      </div>
    </div>
  )
}
