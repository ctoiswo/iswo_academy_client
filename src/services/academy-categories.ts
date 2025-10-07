export interface AcademyCategory {
  id: number
  name: string
  description: string
  slug: string
  icon: string
  color: string
  academies_count: number
  academies: Academy[]
}

export interface Academy {
  id: number
  name: string
  description: string
  slug: string
  monthly_price: number
  subscription_required: boolean
  creator: {
    id: number
    name: string
  } | null
  courses_count: number
  enrolled_users_count: number
}

class AcademyCategoriesService {
  private baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'

  async getCategories(options?: {
    search?: string
    category?: string
    sortBy?: string
  }): Promise<AcademyCategory[]> {
    try {
      const url = new URL(`${this.baseUrl}/academy_categories`)

      if (options?.search) {
        url.searchParams.append('search', options.search)
      }

      if (options?.category && options.category !== 'all') {
        url.searchParams.append('category', options.category)
      }

      if (options?.sortBy) {
        url.searchParams.append('sort_by', options.sortBy)
      }

      const response = await fetch(url.toString())

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.categories || []
    } catch (error) {
      console.error('Error fetching academy categories:', error)
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories')
    }
  }

  async getCategoryBySlug(slug: string): Promise<{ category: Omit<AcademyCategory, 'academies'>, academies: Academy[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/academy_categories/${slug}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        category: data.category,
        academies: data.academies || []
      }
    } catch (error) {
      console.error(`Error fetching category ${slug}:`, error)
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch category')
    }
  }

  // Helper method to get categories with academies filtered by criteria
  async getCategoriesWithAcademies(options?: {
    search?: string
    category?: string
    sortBy?: string
    minAcademies?: number
    onlyWithAcademies?: boolean
  }): Promise<AcademyCategory[]> {
    const categories = await this.getCategories({
      search: options?.search,
      category: options?.category,
      sortBy: options?.sortBy
    })

    if (!options) return categories

    return categories.filter(category => {
      if (options.onlyWithAcademies && category.academies_count === 0) {
        return false
      }

      if (options.minAcademies && category.academies_count < options.minAcademies) {
        return false
      }

      return true
    })
  }
}

export const academyCategoriesService = new AcademyCategoriesService()