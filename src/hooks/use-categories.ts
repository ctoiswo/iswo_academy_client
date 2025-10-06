import { useState, useEffect, useRef } from 'react'
import { academyCategoriesService, AcademyCategory } from '@/services/academy-categories'
import { useDebounce } from './use-debounce'

interface UseCategoriesOptions {
  search?: string
  category?: string
  sortBy?: string
  onlyWithAcademies?: boolean
  minAcademies?: number
}

export function useCategories(options?: UseCategoriesOptions) {
  const [categories, setCategories] = useState<AcademyCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounce search query para evitar muchas llamadas
  const debouncedSearch = useDebounce(options?.search, 500)

  const fetchCategories = async (fetchOptions?: UseCategoriesOptions) => {
    try {
      setLoading(true)
      setError(null)

      const data = await academyCategoriesService.getCategoriesWithAcademies(fetchOptions)
      setCategories(data)
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
  }, [debouncedSearch, options?.category, options?.sortBy])

  const refetch = () => {
    fetchCategories()
  }

  // Calculate stats from categories
  const stats = {
    totalCategories: categories.length,
    totalAcademies: categories.reduce((sum, cat) => sum + cat.academies_count, 0),
    totalStudents: categories.reduce((sum, cat) =>
      sum + cat.academies.reduce((academySum, academy) => academySum + academy.enrolled_users_count, 0), 0
    ),
    categoriesWithAcademies: categories.filter(cat => cat.academies_count > 0).length
  }

  return {
    categories,
    loading,
    error,
    refetch,
    stats
  }
}