import { useState, useEffect } from 'react'
import { academyCategoryService, type AcademyCategory } from '@/services/academy-category-service'
import { useDebounce } from './use-debounce'

interface UseCategoriesOptions {
  search?: string
  category?: string
  sortBy?: string
  onlyWithAcademies?: boolean
  minAcademies?: number
}

// Extended interface with computed count
interface AcademyCategoryWithCount extends AcademyCategory {
  academies_count: number
}

export function useCategories(options?: UseCategoriesOptions) {
  const [categories, setCategories] = useState<AcademyCategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounce search query para evitar muchas llamadas
  const debouncedSearch = useDebounce(options?.search, 500)

  const fetchCategories = async (fetchOptions?: UseCategoriesOptions) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all categories with full view (includes academies)
      const data = await academyCategoryService.getCategories('full')
      
      // Add computed academies_count to each category
      const categoriesWithCount: AcademyCategoryWithCount[] = data.map((cat: AcademyCategory) => ({
        ...cat,
        academies_count: cat.academies?.length || 0
      }))

      // Apply filters if provided
      let filteredCategories = categoriesWithCount

      // Filter by search if provided
      if (debouncedSearch) {
        filteredCategories = filteredCategories.filter((cat: AcademyCategoryWithCount) =>
          cat.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          cat.description.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      }

      // Filter by minimum academies if provided
      if (fetchOptions?.onlyWithAcademies) {
        filteredCategories = filteredCategories.filter((cat: AcademyCategoryWithCount) => cat.academies_count > 0)
      }

      if (fetchOptions?.minAcademies !== undefined) {
        filteredCategories = filteredCategories.filter((cat: AcademyCategoryWithCount) => 
          cat.academies_count >= (fetchOptions.minAcademies || 0)
        )
      }

      setCategories(filteredCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories({
      ...options,
      search: debouncedSearch
    })
  }, [debouncedSearch, options?.category, options?.sortBy, options?.onlyWithAcademies, options?.minAcademies])

  const refetch = () => {
    fetchCategories(options)
  }

  // Calculate stats from categories
  const stats = {
    totalCategories: categories.length,
    totalAcademies: categories.reduce((sum: number, cat: AcademyCategoryWithCount) => sum + cat.academies_count, 0),
    totalStudents: 0, // Note: enrolled_users_count is not available in the current academy type from this endpoint
    categoriesWithAcademies: categories.filter((cat: AcademyCategoryWithCount) => cat.academies_count > 0).length
  }

  return {
    categories,
    loading,
    error,
    refetch,
    stats
  }
}