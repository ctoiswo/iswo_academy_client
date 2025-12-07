import { useState, useEffect } from 'react'
import { academyCategoryService } from '@/services/academy-category-service'
import { useDebounce } from './use-debounce'
import type { CategoryWithCount } from '@/types'

interface UseCategoriesOptions {
  search?: string
  category?: string
  sortBy?: string
  onlyWithAcademies?: boolean
  minAcademies?: number
}

export function useCategories(options?: UseCategoriesOptions) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounce search query para evitar muchas llamadas
  const debouncedSearch = useDebounce(options?.search, 500)

  const fetchCategories = async (fetchOptions?: UseCategoriesOptions) => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all categories with summary view (includes academies_count)
      const data = await academyCategoryService.getCategories('summary')
      
      // Map to CategoryWithCount format
      const categoriesWithCount: CategoryWithCount[] = data.map((cat) => ({
        ...cat,
        count: cat.academies_count
      }))

      // Apply filters if provided
      let filteredCategories = categoriesWithCount

      // Filter by search if provided
      if (debouncedSearch) {
        filteredCategories = filteredCategories.filter((cat) =>
          cat.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          cat.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      }

      // Filter by minimum academies if provided
      if (fetchOptions?.onlyWithAcademies) {
        filteredCategories = filteredCategories.filter((cat) => cat.academies_count > 0)
      }

      if (fetchOptions?.minAcademies !== undefined) {
        filteredCategories = filteredCategories.filter((cat) => 
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
    totalAcademies: categories.reduce((sum, cat) => sum + cat.academies_count, 0),
    totalStudents: 0, // Note: enrolled_users_count is not available in the current academy type from this endpoint
    categoriesWithAcademies: categories.filter((cat) => cat.academies_count > 0).length
  }

  return {
    categories,
    loading,
    error,
    refetch,
    stats
  }
}