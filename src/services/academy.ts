import apiClient from '@/lib/api-client'

export interface Course {
  id: number
  title: string
  description: string
  slug: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration_weeks: number
  price: string
  discount_price?: string
  image_url?: string
  instructor_name: string
  lessons_count: number
  students_count: number
  rating: number
  reviews_count: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface AcademyDetails {
  id: number
  name: string
  description: string
  slug: string
  logo_url?: string
  banner_url?: string
  monthly_price: string
  subscription_required: boolean
  creator: {
    id: number
    name: string
    avatar_url?: string
    bio?: string
  }
  courses_count: number
  enrolled_users_count: number
  total_lessons: number
  total_duration_hours: number
  rating: number
  reviews_count: number
  category: {
    id: number
    name: string
    slug: string
    icon: string
    color: string
  }
  courses: Course[]
  created_at: string
  updated_at: string
}

export const academyService = {
  async getAcademyBySlug(slug: string): Promise<AcademyDetails> {
    try {
      const response = await apiClient.get(`/api/v1/academies/${slug}`)
      return response.data.academy
    } catch (error) {
      console.error('Error fetching academy:', error)
      throw new Error('Error al cargar la academia')
    }
  },

  async getAcademyCourses(academySlug: string, options?: {
    level?: string
    sortBy?: string
    limit?: number
  }): Promise<Course[]> {
    try {
      const params = new URLSearchParams()
      if (options?.level) params.append('level', options.level)
      if (options?.sortBy) params.append('sort_by', options.sortBy)
      if (options?.limit) params.append('limit', options.limit.toString())

      const queryString = params.toString()
      const url = `/api/v1/academies/${academySlug}/courses${queryString ? `?${queryString}` : ''}`

      const response = await apiClient.get(url)
      return response.data.courses
    } catch (error) {
      console.error('Error fetching academy courses:', error)
      throw new Error('Error al cargar los cursos de la academia')
    }
  }
}