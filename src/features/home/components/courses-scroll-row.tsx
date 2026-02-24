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
        className='flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar'
      >
        {courses.map((course) => (
          <LandingCourseCard key={course.id} course={course} />
        ))}
      </div>

      {canScrollLeft && (
        <div className='pointer-events-none absolute top-0 left-0 bottom-4 w-12 bg-gradient-to-r from-background to-transparent' />
      )}
      {canScrollRight && (
        <div className='pointer-events-none absolute top-0 right-0 bottom-4 w-12 bg-gradient-to-l from-background to-transparent' />
      )}
    </div>
  )
}
