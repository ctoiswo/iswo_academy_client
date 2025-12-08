/**
 * Assignment related types
 * Matching backend assignment_json structure
 */

// Submission status types
export type SubmissionStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'graded'

// Rubric criterion structure
export interface RubricCriterion {
  id: string
  name: string
  description: string
  max_points: number
}

// Summary view - without rubric (default for index)
export interface AssignmentSummary {
  id: number
  title: string
  description: string | null
  instructions: string | null
  lesson_id: number
  section_id: number | null
  max_points: number
  passing_score: number
  max_attempts: number
  require_file_upload: boolean
  require_text_submission: boolean
  max_file_uploads: number
  max_file_size_mb: number
  allowed_file_types: string[] | null
  available_from: string | null
  due_at: string | null
  late_submission_until: string | null
  late_penalty_percent: number
  allow_resubmission: boolean
  auto_accept_on_time: boolean
  peer_review_enabled: boolean
  peer_review_count: number
  submission_count: number
  graded_count: number
  average_score: number
  available: boolean
  past_due: boolean
  accepting_submissions: boolean
  days_until_due: number | null
  lesson: {
    id: number
    title: string
  } | null
  section: {
    id: number
    title: string
  } | null
  creator: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

// Full view - includes rubric data (for show endpoint with include_rubric: true)
export interface AssignmentFull extends AssignmentSummary {
  rubric?: RubricCriterion[]
  rubric_criteria?: RubricCriterion[]
  total_rubric_points?: number
}

// Default type (most common usage)
export type Assignment = AssignmentFull

// Assignment statistics
export interface AssignmentStatistics {
  submission_count: number
  graded_count: number
  average_score: number
  completion_rate: number
  on_time_rate: number
  pending_grading_count: number
}

// Assignment submission structure
export interface AssignmentSubmission {
  id: number
  user: {
    id: number
    name: string
    email: string
  }
  status: SubmissionStatus
  submitted_at: string | null
  graded_at: string | null
  score: number | null
  feedback: string | null
  is_late: boolean
  attempt_number: number
  attachments_count: number
}

// Legacy type for backwards compatibility
export interface Assignment_Legacy {
  id: number
  title: string
  description?: string | null
  instructions?: string | null
  max_points: number
  passing_score: number
  max_attempts: number
  allow_resubmission: boolean
  require_file_upload: boolean
  require_text_submission: boolean
  max_file_uploads: number
  max_file_size_mb: number
  allowed_file_types?: string | null
  available_from?: string | null
  due_at?: string | null
  late_submission_until?: string | null
  late_penalty_percent: number
  auto_accept_on_time: boolean
  peer_review_enabled: boolean
  peer_review_count: number
  rubric?: Record<string, any>
  submission_count: number
  graded_count: number
  average_score?: number | null
  course_id: number
  lesson_id: number
  section_id?: number | null
  creator_id: number
  created_at: string
  updated_at: string
}
