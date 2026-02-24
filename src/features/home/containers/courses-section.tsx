import { useRef, useState, useEffect } from 'react'
import { useFeaturedCourses } from '@/hooks/use-featured-courses'
import { CoursesSectionHeader } from '../components/courses-section-header'
import { CoursesScrollRow } from '../components/courses-scroll-row'
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
    scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
  }

  return (
    <section id='cursos' className='relative py-24'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-10'>
        <CoursesSectionHeader
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          onScrollLeft={() => scroll('left')}
          onScrollRight={() => scroll('right')}
        />
        {isLoading ? (
          <div className='flex items-center justify-center h-48 text-muted-foreground text-sm'>
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
