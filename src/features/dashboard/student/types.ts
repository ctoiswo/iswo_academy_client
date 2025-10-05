// Student dashboard specific types
export interface Course {
  id: number
  title: string
  description: string
  price: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  is_published: boolean
  thumbnail_url?: string
  banner_url?: string
  duration_minutes: number
  enrollment_count: number
  academy_id: number
  creator_id?: number
  created_at: string
  updated_at: string
}

export interface Enrollment {
  id: number
  user_id: number
  course_id: number
  status: 'active' | 'completed' | 'suspended'
  progress_percentage: number
  enrolled_at: string
  completed_at?: string
  created_at: string
  updated_at: string
  course: Course
}

export interface Certificate {
  id: number
  user_id: number
  course_id: number
  enrollment_id: number
  certificate_number: string
  issued_at: string
  revoked_at?: string
  revoked_by?: number
  revoked_reason?: string
  course: Course
}

export interface LearningProgress {
  course_id: number
  course_title: string
  progress_percentage: number
  completed_lessons: number
  total_lessons: number
  last_accessed: string
  estimated_completion: string
}

export interface StudentStats {
  total_enrollments: number
  completed_courses: number
  certificates_earned: number
  study_streak_days: number
  total_study_hours: number
  average_progress: number
}

export interface UpcomingLesson {
  id: number
  title: string
  course_title: string
  course_id: number
  duration_minutes: number
  scheduled_for?: string
}

export interface CourseRecommendation {
  id: number
  title: string
  description: string
  thumbnail_url?: string
  difficulty_level: string
  price: number
  rating: number
  enrollment_count: number
  reason: string // Why this course is recommended
}

export interface StudentDashboardData {
  stats: StudentStats
  enrollments: Enrollment[]
  certificates: Certificate[]
  learning_progress: LearningProgress[]
  upcoming_lessons: UpcomingLesson[]
  recommendations: CourseRecommendation[]
}