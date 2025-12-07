/**
 * Student Assignment types
 * Used for student-facing assignment views and listings
 */

export type StudentAssignmentStatus = 'upcoming' | 'active' | 'past_due'

export interface StudentAssignment {
  id: number
  title: string
  description: string | null
  instructions: string | null
  max_points: number
  passing_score: number
  due_at: string | null
  available_from: string | null
  late_submission_until: string | null
  late_penalty_percent: number
  require_file_upload: boolean
  require_text_submission: boolean
  max_file_uploads: number
  lesson: {
    id: number
    title: string
  } | null
  section: {
    id: number
    title: string
  } | null
  is_past_due: boolean
  days_until_due: number | null
  status: StudentAssignmentStatus
}

export interface CourseAssignments {
  course: {
    id: number
    title: string
    slug: string
    image_url: string | null
  }
  assignments: StudentAssignment[]
}

export interface StudentAssignmentsSummary {
  total_assignments: number
  courses_with_assignments: number
  past_due: number
  upcoming: number
}
