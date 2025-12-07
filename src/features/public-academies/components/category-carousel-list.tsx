import { useMemo } from 'react'
import type { AcademyCategory } from '@/types'
import { motion } from 'framer-motion'
import { BookOpen, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { groupAcademiesByCategory } from '@/lib/helpers/academy'
import { CategoryCarousel } from '@/components/category-carousel'
import { AcademyGrid } from './academy-grid'

interface CategoryCarouselListProps {
  academies: any[]
  hasFilters: boolean
  isFiltering: boolean
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  setSearchInput: (value: string) => void
  setSearchQuery: (value: string) => void
  navigate: any
  allCategories: AcademyCategory[]
  searchQuery: string
}

export function CategoryCarouselList({
  academies,
  hasFilters,
  isFiltering,
  selectedCategory,
  setSelectedCategory,
  setSearchInput,
  setSearchQuery,
  navigate,
  allCategories,
  searchQuery,
}: CategoryCarouselListProps) {
  const { t } = useTranslation()

  // Group academies by category only when no filters are active
  const academiesByCategory = useMemo(() => {
    if (!academies.length) return []

    // If filters are active, return academies for grid display
    if (hasFilters) {
      const categoryName =
        selectedCategory !== 'all'
          ? allCategories.find((c) => c.slug === selectedCategory)?.name ||
            t('academies.grid.results')
          : t('academies.grid.results')

      return {
        filtered: true,
        categoryName,
        academies: academies.map((academy) => ({
          id: academy.id,
          name: academy.name,
          slug: academy.slug,
          description: academy.description,
          banner_url: academy.banner_url,
          monthly_price: academy.monthly_price,
          enrolled_users_count: academy.enrolled_users_count,
          courses_count: academy.courses_count,
        })),
      }
    }

    // No filters: group by category for carousels
    const grouped = groupAcademiesByCategory(academies)
    return { filtered: false, categories: Object.values(grouped) }
  }, [academies, hasFilters, selectedCategory, allCategories])

  return (
    <div className='relative'>
      {/* Loading indicator when filtering */}
      {hasFilters && isFiltering && (
        <div className='bg-background/80 absolute top-4 right-4 z-10 rounded-full border p-2 shadow-sm backdrop-blur-sm'>
          <Loader2 className='text-muted-foreground h-4 w-4 animate-spin' />
        </div>
      )}

      {'filtered' in academiesByCategory &&
      academiesByCategory.filtered &&
      academiesByCategory.academies ? (
        /* Filtered view - Full grid */
        <AcademyGrid
          academies={academiesByCategory.academies}
          categoryName={academiesByCategory.categoryName}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSearchInput={setSearchInput}
          setSearchQuery={setSearchQuery}
          navigate={navigate}
          searchQuery={searchQuery}
        />
      ) : 'categories' in academiesByCategory &&
        academiesByCategory.categories &&
        academiesByCategory.categories.length > 0 ? (
        /* Normal view - Carousels by category */
        academiesByCategory.categories.map((category: any) => (
          <CategoryCarousel
            key={category.slug}
            title={category.name}
            academies={category.academies}
            categorySlug={category.slug}
          />
        ))
      ) : (
        <motion.div
          className='py-16 text-center'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <BookOpen className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
          <h3 className='mb-2 text-xl font-semibold'>
            {t('academies.noAvailable')}
          </h3>
        </motion.div>
      )}
    </div>
  )
}
