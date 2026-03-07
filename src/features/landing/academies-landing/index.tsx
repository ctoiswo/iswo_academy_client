import { useState, useEffect, useRef } from 'react'
import { Footer, Navbar } from '@/components'
import { usePublicAcademiesInfinite } from '@/hooks/use-academies'
import { useAcademyCategories } from '@/hooks/use-featured-content'
import { useDebounce } from '@/hooks/use-debounce'
import { AcademiesHero } from './containers/academies-hero'
import { AcademiesFilter } from './containers/academies-filter'
import { AcademiesGrid } from './containers/academies-grid'
import { AcademiesCta } from './components/academies-cta'
import { Particles } from '@/components/ui/particles'

export function AcademiesLandingPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const debouncedSearch = useDebounce(search, 350)

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = usePublicAcademiesInfinite({
    search: debouncedSearch || undefined,
    category: activeCategory ?? undefined,
    per_page: 12,
  })

  const { data: categories = [] } = useAcademyCategories()

  // Flatten all pages into a single academies array
  const academies = data?.pages.flatMap((page) => page.data) ?? []
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
    setActiveCategory(null)
  }

  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Particles
        className='fixed inset-0 z-0 pointer-events-none'
        quantity={120}
        ease={80}
        size={0.4}
        staticity={50}
      />
      <Navbar />
      <AcademiesHero
        search={search}
        onSearchChange={setSearch}
        totalAcademies={totalCount}
      />

      <main className='flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 pb-24'>
        <AcademiesFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          totalCount={totalCount}
          loadedCount={academies.length}
        />

        <AcademiesGrid
          academies={academies}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          sentinelRef={sentinelRef}
          onClearFilters={clearFilters}
        />

        <AcademiesCta />
      </main>

      <Footer />
    </div>
  )
}
