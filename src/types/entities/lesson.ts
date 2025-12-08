/**
 * Lesson and Section related types
 */

export type LessonType =
  | 'video'
  | 'text'
  | 'quiz'
  | 'assignment'
  | 'interactive'
  | 'document'
export type VideoProvider =
  | 'none'
  | 'youtube'
  | 'vimeo'
  | 'google_drive'
  | 's3_direct'
  | 'bunny_cdn'
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Lesson {
  id: number
  course_id: number
  section_id: number
  title: string
  content?: string
  content_json?: Record<string, any>
  lesson_type: LessonType
  video_provider?: VideoProvider
  video_identifier?: string
  video_url?: string
  video_metadata?: Record<string, any>
  duration_minutes?: number
  position: number
  is_free: boolean
  processing_status?: ProcessingStatus
  processing_error?: string
  created_at: string
  updated_at: string
  mux_playback_id?: string
  mux_asset_id?: string
}

export interface Section {
  id: number
  title: string
  description?: string
  order: number
  course_id: number
  lessons?: Lesson[]
  lessons_count?: number
  created_at?: string
  updated_at?: string
}

export interface SectionWithLessons extends Section {
  lessons: Lesson[]
}

export interface LessonProgress {
  id: number
  lesson_id: number
  user_id: number
  is_completed: boolean
  progress_percentage: number
  time_spent_minutes: number
  last_accessed_at: string
  completed_at?: string
}
