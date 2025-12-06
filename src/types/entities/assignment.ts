/**
 * Assignment related types
 */

// Submission status enum
export type SubmissionStatus = 0 | 1 | 2 | 3 | 4 // 0: draft, 1: submitted, 2: under_review, 3: graded, 4: returned

export interface Assignment {
  id: number
  title: string // not null
  description?: string | null
  instructions?: string | null
  
  // Scoring
  max_points: number // default 100
  passing_score: number // default 70
  
  // Attempts and resubmission
  max_attempts: number // default 1
  allow_resubmission: boolean // default false
  
  // File upload settings
  require_file_upload: boolean // default true
  require_text_submission: boolean // default false
  max_file_uploads: number // default 5
  max_file_size_mb: number // bigint, default 10
  allowed_file_types?: string | null // text
  
  // Dates
  available_from?: string | null
  due_at?: string | null
  late_submission_until?: string | null
  
  // Late penalty
  late_penalty_percent: number // default 10
  auto_accept_on_time: boolean // default false
  
  // Peer review
  peer_review_enabled: boolean // default false
  peer_review_count: number // default 2
  
  // Rubric
  rubric?: Record<string, any> // jsonb, default {}
  
  // Stats
  submission_count: number // default 0
  graded_count: number // default 0
  average_score?: number | null // decimal(5,2)
  
  // Relations
  course_id: number
  lesson_id: number
  section_id?: number | null
  creator_id: number
  
  // Relations data
  course?: {
    id: number
    title: string
    slug: string
  }
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface AssignmentSubmission {
  id: number
  assignment_id: number
  user_id: number
  enrollment_id: number
  
  // Content
  content?: string | null // text
  student_notes?: string | null
  
  // Scoring
  score?: number | null // integer
  percentage?: number | null // decimal(5,2)
  passed?: boolean | null
  
  // Feedback
  feedback?: string | null
  rubric_scores?: Record<string, any> // jsonb, default {}
  
  // Attempts
  attempt_number: number // default 1
  
  // Late submission
  is_late: boolean // default false
  days_late: number // default 0
  late_penalty_applied: number // default 0
  
  // Timestamps
  started_at?: string | null
  submitted_at?: string | null
  last_saved_at?: string | null
  graded_at?: string | null
  
  // Status
  status: SubmissionStatus // integer enum, default 0
  
  // Relations
  graded_by_id?: number | null
  
  created_at: string
  updated_at: string
}

export interface CourseAssignments {
  course: {
    id: number
    title: string
    slug: string
    thumbnail_url?: string
  }
  assignments: Assignment[]
}
