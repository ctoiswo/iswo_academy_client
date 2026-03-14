import { Skeleton } from '@/components/ui/skeleton'

export function CourseCardSkeleton() {
  return (
    <div className='border-border/50 bg-card flex flex-col overflow-hidden rounded-xl border'>
      <Skeleton className='h-40 w-full' />
      <div className='flex flex-col gap-3 px-5 pt-4 pb-5'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-full' />
        <Skeleton className='h-3 w-2/3' />
        <Skeleton className='mt-2 h-8 w-full' />
      </div>
    </div>
  )
}
