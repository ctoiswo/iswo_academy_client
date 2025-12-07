/**
 * Learning Path Enrollment Entity Types
 */

export interface LearningPathEnrollment {
  id: number
  user_id: number
  learning_path_id: number
  status: string
  progress_percentage: number
  enrolled_at: string
  completed_at: string | null
  user: {
    id: number
    name: string
    email: string
    avatar_url: string | null
  }
  completed_courses: number
  total_courses: number
  remaining_courses: number
  next_course: {
    id: number
    title: string
    slug: string
    difficulty_level: string
  } | null
}
