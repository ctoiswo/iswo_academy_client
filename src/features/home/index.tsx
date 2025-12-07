/**
 * Home Page
 * Main landing page with featured academies and courses
 */
import { useState } from 'react'
import {
  useFeaturedAcademies,
  useAcademyCategories,
  useFeaturedCourses,
} from '@/hooks/use-featured-content'
import { Header } from './components/header'
import { AcademiesSection } from './components/academies-section'
import { CategoriesFilter } from './components/categories-filter'
import { CoursesSection } from './components/courses-section'
import { CTASection } from './components/cta-section'
import { Footer } from './components/footer'
import { HeroSection } from './components/hero-section'

export function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  // Fetch data
  const categoriesQuery = useAcademyCategories()
  const academiesQuery = useFeaturedAcademies(selectedCategory || undefined)
  const coursesQuery = useFeaturedCourses(selectedCategory || undefined)

  return (
    <div className='bg-background min-h-screen'>
      <Header />

      <HeroSection />

      <CategoriesFilter
        categories={categoriesQuery.data || []}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isLoading={categoriesQuery.isLoading}
      />

      <AcademiesSection
        data={academiesQuery.data || []}
        isLoading={academiesQuery.isLoading}
        isError={academiesQuery.isError}
        onRetry={academiesQuery.refetch}
      />

      <CoursesSection
        data={coursesQuery.data || []}
        isLoading={coursesQuery.isLoading}
      />

      <CTASection />

      <Footer />
    </div>
  )
}
