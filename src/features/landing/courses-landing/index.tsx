import { useState, useEffect, useRef } from 'react'
import { Footer, Navbar } from '@/components'
import { COURSE_CATEGORIES } from '@/constants/home-constants'
import { usePublicCoursesInfinite } from '@/hooks/use-courses'
import { useDebounce } from '@/hooks/use-debounce'
import { Particles } from '@/components/ui/particles'
import { CoursesFilter } from './containers/courses-filter'
import { CoursesGrid } from './containers/courses-grid'
import { CoursesHero } from './containers/courses-hero'

export function CoursesLandingPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todos')

  // Debounce search to avoid a request on every keystroke
  const debouncedSearch = useDebounce(search, 350)

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    usePublicCoursesInfinite({
      search: debouncedSearch || undefined,
      category: activeCategory !== 'Todos' ? activeCategory : undefined,
      per_page: 12,
    })

  // Flatten all pages into a single courses array
  const courses = data?.pages.flatMap((page) => page.data) ?? []
  const totalCount = data?.pages[0]?.meta.total_count ?? 0

  // Sentinel element observed to trigger the next page fetch
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage()
        }
      },
      { rootMargin: '200px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const clearFilters = () => {
    setSearch('')
    setActiveCategory('Todos')
  }

  return (
    <div className='bg-background flex min-h-screen flex-col'>
      <Particles
        className='pointer-events-none fixed inset-0 z-0'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />
      <Navbar />
      <CoursesHero
        search={search}
        onSearchChange={setSearch}
        totalCourses={totalCount}
      />

      <main className='mx-auto w-full max-w-7xl flex-1 px-4 pb-24 lg:px-8'>
        <CoursesFilter
          categories={COURSE_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          resultsCount={courses.length}
        />

        <CoursesGrid
          courses={courses}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          sentinelRef={sentinelRef}
          onClearFilters={clearFilters}
        />
      </main>

      <Footer />
    </div>
  )
}
