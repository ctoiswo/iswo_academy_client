import { type RefObject } from 'react'
import type { LandingCourse } from '@/types/pages/home'
import { LandingCourseCard } from './landing-course-card'

interface CoursesScrollRowProps {
  courses: LandingCourse[]
  scrollRef: RefObject<HTMLDivElement | null>
  canScrollLeft: boolean
  canScrollRight: boolean
}

export function CoursesScrollRow({
  courses,
  scrollRef,
  canScrollLeft,
  canScrollRight,
}: CoursesScrollRowProps) {
  return (
    <div className='relative'>
      <div
        ref={scrollRef}
        className='no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4'
      >
        {courses.map((course) => (
          <LandingCourseCard key={course.id} course={course} />
        ))}
      </div>

      {canScrollLeft && (
        <div className='from-background pointer-events-none absolute top-0 bottom-4 left-0 w-12 bg-gradient-to-r to-transparent' />
      )}
      {canScrollRight && (
        <div className='from-background pointer-events-none absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l to-transparent' />
      )}
    </div>
  )
}
