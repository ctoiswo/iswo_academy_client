/**
 * Statistics and Analytics related types
 */

/**
 * Platform summary statistics returned by GET /api/v1/stats
 * Used for public-facing displays (hero section, landing pages)
 */
export interface PlatformStats {
  total_students: number
  total_courses: number
  total_academies: number
}

export interface StatItem {
  icon: React.ElementType
  value: string
  label: string
}

export interface GeneralStatistics {
  total_users: number
  total_courses: number
  total_enrollments: number
  active_users_today: number
  revenue_this_month: number
  total_academies: number
  total_students: number
  total_categories: number
}

export interface AcademyStatistics {
  total_students: number
  total_courses: number
  total_revenue: number
  active_students: number
  course_completion_rate: number
  average_rating: number
  total_enrollments: number
  monthly_revenue: number[]
  enrollment_trends: Array<{
    date: string
    count: number
  }>
}

export interface TrendingStatistics {
  trending_courses: Array<{
    id: number
    title: string
    enrollment_count: number
    trend: 'up' | 'down' | 'stable'
  }>
  top_performers: Array<{
    id: number
    name: string
    completion_rate: number
  }>
}
