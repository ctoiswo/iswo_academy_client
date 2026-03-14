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
  is_completed?: boolean
  processing_status?: ProcessingStatus
  processing_error?: string
  created_at: string
  updated_at: string
  mux_playback_id?: string
  mux_asset_id?: string
  user_progress?: LessonUserProgress | null
  attachments?: LessonAttachment[]
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

export interface LessonUserProgress {
  completed: boolean
  completed_at: string | null
  time_spent_seconds: number
  completion_percentage: number
  last_accessed_at: string | null
}

export interface LessonAttachment {
  id: number
  title: string
  description?: string | null
  attachment_type: string
  file_icon: string
  file_extension: string
  file_size_mb: number | null
  required: boolean
  download_url: string | null
}

export interface LessonComment {
  id: number
  body: string
  body_html: string
  created_at: string
  edited: boolean
  edited_at: string | null
  replies_count: number
  reactions_count: number
  parent_id?: number | null
  user: {
    id: number
    full_name: string
    email: string
  } | null
  can_edit?: boolean
  can_delete?: boolean
  replies?: LessonComment[]
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
