import { useState, useEffect } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useAcademies } from '@/hooks/use-academies'
import { useCategories } from '@/hooks/use-categories'
import { useGeneralStatistics } from '@/hooks/use-statistics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PublicHeader } from '@/components/layout/public-header'
import {
  PageHeader,
  StatsSection,
  SearchFilters,
  CategoryCarouselList,
  CTASection,
} from './components'

export function PublicAcademiesPage() {
  const searchParams = useSearch({ strict: false }) as { category?: string }
  const navigate = useNavigate()

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.category || 'all'
  )
  const [sortBy, setSortBy] = useState<
    'popular' | 'rating' | 'students' | 'newest'
  >('popular')

  // Update selected category when URL changes
  useEffect(() => {
    if (searchParams.category) {
      setSelectedCategory(searchParams.category)
    }
  }, [searchParams.category])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Fetch data
  const {
    data: generalStats,
    isLoading: statsLoading,
    error: statsError,
  } = useGeneralStatistics()
  const { categories: allCategories, loading: allCategoriesLoading } =
    useCategories()

  const hasFilters = Boolean(searchQuery || selectedCategory !== 'all')
  const {
    data: academies = [],
    isLoading: isFiltering,
    error: academiesError,
  } = useAcademies({
    search: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sort_by: sortBy,
  })

  // Loading and error states
  const isInitialLoading =
    (allCategoriesLoading || statsLoading || isFiltering) && !hasFilters
  const error = academiesError || statsError

  if (isInitialLoading) {
    return (
      <div className='bg-background min-h-screen'>
        <PublicHeader />
        <div className='container mx-auto px-4 py-8'>
          <div className='flex min-h-[400px] flex-col items-center justify-center'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            <p className='text-muted-foreground mt-4'>Cargando academias...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='bg-background min-h-screen'>
        <PublicHeader />
        <div className='container mx-auto px-4 py-8'>
          <Card className='mx-auto max-w-md'>
            <CardHeader>
              <CardTitle className='text-red-600'>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>
                {error instanceof Error ? error.message : String(error)}
              </p>
              <Button
                onClick={() => window.location.reload()}
                className='mt-4 w-full'
              >
                Intentar de nuevo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const stats = {
    totalAcademies: hasFilters
      ? academies.length
      : (generalStats?.total_academies ?? 0),
    totalStudents: generalStats?.total_students ?? 0,
    totalCategories: generalStats?.total_categories ?? 0,
  }

  return (
    <div className='bg-background min-h-screen'>
      <PublicHeader />

      <div className='container mx-auto px-4 py-8'>
        <PageHeader
          totalAcademies={stats.totalAcademies}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />

        <StatsSection
          totalAcademies={stats.totalAcademies}
          totalStudents={stats.totalStudents}
          totalCategories={stats.totalCategories}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />

        <SearchFilters
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={allCategories}
          searchQuery={searchQuery}
          navigate={navigate}
        />

        <CategoryCarouselList
          academies={academies}
          hasFilters={hasFilters}
          isFiltering={isFiltering}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSearchInput={setSearchInput}
          setSearchQuery={setSearchQuery}
          navigate={navigate}
          allCategories={allCategories}
          searchQuery={searchQuery}
        />

        <CTASection />
      </div>
    </div>
  )
}
