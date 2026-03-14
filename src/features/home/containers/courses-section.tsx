import { useRef, useState, useEffect } from 'react'
import { useFeaturedCourses } from '@/hooks/use-featured-courses'
import { CoursesScrollRow } from '../components/courses-scroll-row'
import { CoursesSectionHeader } from '../components/courses-section-header'
import { CoursesViewAll } from '../components/courses-view-all'

export function CoursesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const { data: courses = [], isLoading } = useFeaturedCourses()

  const checkScroll = () => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    el?.addEventListener('scroll', checkScroll, { passive: true })
    return () => el?.removeEventListener('scroll', checkScroll)
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -320 : 320,
      behavior: 'smooth',
    })
  }

  return (
    <section id='cursos' className='relative py-24'>
      <div className='mx-auto flex max-w-7xl flex-col gap-10 px-4 lg:px-8'>
        <CoursesSectionHeader
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={() => scroll('left')}
          onScrollRight={() => scroll('right')}
        />
        {isLoading ? (
          <div className='text-muted-foreground flex h-48 items-center justify-center text-sm'>
            Cargando cursos…
          </div>
        ) : (
          <CoursesScrollRow
            courses={courses}
            scrollRef={scrollRef}
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
          />
        )}
        <CoursesViewAll />
      </div>
    </section>
  )
}
