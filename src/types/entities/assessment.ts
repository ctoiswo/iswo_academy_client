/**
 * Assessment, Quiz, and Question related types
 * Matching backend assessment_json structure
 */

export type AssessmentType = 'Quiz' | 'Exam'

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'multiple_select'
  | 'short_answer'
  | 'essay'
  | 'fill_in_blank'
  | 'matching'
  | 'ordering'

// Answer structure for questions
export interface Answer {
  id: number
  answer_text: string
  is_correct: boolean
  position: number
}

// Question structure
export interface Question {
  id: number
  question_text: string
  question_type: QuestionType
  points: number
  position: number
  explanation?: string
  answers: Answer[]
}

// Summary view - without questions array (default for index)
export interface AssessmentSummary {
  id: number
  type: AssessmentType
  title: string
  description: string | null
  section_id: number | null
  section: {
    id: number
    title: string
  } | null
  passing_score: number
  attempts_allowed: number | null
  time_limit_minutes: number | null
  weight_percentage: number
  retake_waiting_hours: number
  question_pool_size: number | null
  published: boolean
  randomize_questions: boolean
  randomize_answers: boolean
  show_correct_answers: boolean
  require_all_sections_complete: boolean
  total_points: number
  questions_count: number
  attempts_count: number
  user_passed: boolean | null
  created_at: string
  updated_at: string
}

// Full view - includes questions array (for show endpoint)
export interface AssessmentFull extends AssessmentSummary {
  questions: Question[]
}

// Default type (most common usage)
export type Assessment = AssessmentFull

// Assessment attempt structure
export interface AssessmentAttempt {
  id: number
  user: {
    id: number
    name: string
    email: string
  }
  attempt_number: number
  score: number | null
  max_score: number | null
  percentage: number | null
  passed: boolean | null
  status: 'completed' | 'in_progress'
  time_spent_seconds: number | null
  started_at: string
  completed_at: string | null
  created_at: string
}

// Assessment statistics
export interface AssessmentStatistics {
  total_attempts: number
  completed_attempts: number
  average_score: number
  pass_rate: number
  completion_rate: number
  total_points: number
}

// Legacy types for backwards compatibility
export interface QuestionOption {
  id: number
  option_text: string
  is_correct: boolean
  order: number
}

// --- Student quiz-taking types ---

// Answer option as shown to student (no is_correct)
export interface StudentAnswer {
  id: number
  answer_text: string
  position: number
}

// Question as shown to student (no is_correct on answers)
export interface StudentQuestion {
  id: number
  question_text: string
  question_type: QuestionType
  points: number
  position: number
  answers: StudentAnswer[]
}

// Returned when starting an attempt
export interface QuizAttemptSession {
  attempt_id: number
  assessment: {
    id: number
    title: string
    description: string | null
    time_limit_minutes: number | null
    passing_score: number
    questions_count: number
  }
  questions: StudentQuestion[]
}

// Answer to submit
export interface SubmitAnswer {
  question_id: number
  answer_ids?: number[]
  answer_id?: number
  answer_text?: string
}

// Result after completing an attempt
export interface QuizAttemptResult {
  passed: boolean
  score: number | null
  max_score: number | null
  percentage: number | null
  attempt_number: number
}

// my_attempts response
export interface MyAttemptsResponse {
  attempts: Pick<AssessmentAttempt, 'id' | 'attempt_number' | 'score' | 'max_score' | 'percentage' | 'passed' | 'status' | 'started_at' | 'completed_at'>[]
  passed: boolean
  best_score: number | null
}
