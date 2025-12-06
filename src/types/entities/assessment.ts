/**
 * Assessment, Quiz, and Question related types
 */

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay'

export interface Assessment {
  id: number
  title: string
  description?: string
  type: 'quiz' | 'exam' | 'practice'
  time_limit_minutes?: number
  passing_score: number
  max_attempts?: number
  course_id: number
  is_published: boolean
  created_at: string
  updated_at?: string
}

export interface Question {
  id: number
  assessment_id: number
  question_text: string
  question_type: QuestionType
  points: number
  order: number
  options?: QuestionOption[]
  correct_answer?: string
  explanation?: string
  created_at?: string
  updated_at?: string
}

export interface QuestionOption {
  id: number
  option_text: string
  is_correct: boolean
  order: number
}

export interface AssessmentAttempt {
  id: number
  assessment_id: number
  user_id: number
  score: number
  max_score: number
  passed: boolean
  started_at: string
  completed_at?: string
  answers?: Answer[]
}

export interface Answer {
  id: number
  question_id: number
  attempt_id: number
  answer_text: string
  is_correct: boolean
  points_earned: number
}
