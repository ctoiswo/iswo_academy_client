import { Loader2 } from 'lucide-react'
import { CourseCard } from '../components/course-card'
import { CourseCardSkeleton } from '../components/course-card-skeleton'
import { EmptyCoursesState } from '../components/empty-courses-state'
import { CoursesGridProps } from '@/types/pages/home'

export function CoursesGrid({ courses, isLoading, isFetchingNextPage, sentinelRef, onClearFilters }: CoursesGridProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {Array.from({ length: 8 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (courses.length === 0) {
    return <EmptyCoursesState onClearFilters={onClearFilters} />
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
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

