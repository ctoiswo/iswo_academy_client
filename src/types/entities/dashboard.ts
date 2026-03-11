/**
 * Dashboard aggregated response types
 * Used by the DashboardController (student / teacher / admin endpoints)
 */

export interface DashboardAssignment {
  id: number
  title: string
  course_title: string
  course_slug: string
  due_at: string | null
  days_until_due: number | null
  is_past_due: boolean
  status: 'upcoming' | 'active' | 'past_due'
  type: 'assignment'
}

export interface DashboardLPEnrollment {
  id: number
  learning_path_id: number
  title: string
  slug: string
  description: string
  progress_percentage: number
  status: 'active' | 'completed' | 'suspended'
  total_courses: number
  completed_courses: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_duration_hours: number
  enrolled_at: string
}

export interface DashboardAchievement {
  id: number
  achievement_id: number
  name: string
  description: string
  category: 'learning' | 'social' | 'consistency' | 'excellence' | 'exploration'
  progress_percentage: number
  completed_at: string | null
  icon_url: string | null
  current_value: number
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | null
}

export interface DashboardStreak {
  current_streak: number
  longest_streak: number
  total_active_days: number
  streak_start_date: string | null
  last_activity_date: string | null
  longest_streak_start_date: string | null
  longest_streak_end_date: string | null
  weekly_activity: Record<string, boolean>
}

export interface StudentDashboardData {
  pending_assignments: DashboardAssignment[]
  learning_path_enrollments: DashboardLPEnrollment[]
  user_achievements: DashboardAchievement[]
  streak: DashboardStreak
}

export interface StudentDashboardResponse {
  data: StudentDashboardData
}
