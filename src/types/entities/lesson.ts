/**
 * Lesson and Section related types
 */

// Enums matching DB
export type LessonType = 0 | 1 | 2 | 3 // 0: video, 1: text, 2: quiz, 3: assignment
export type VideoProvider = 0 | 1 | 2 | 3 | 4 | 5 // 0: none, 1: youtube, 2: vimeo, 3: google_drive, 4: s3_direct, 5: bunny_cdn
export type ProcessingStatus = 0 | 1 | 2 | 3 // 0: pending, 1: processing, 2: completed, 3: failed

export interface Lesson {
  id: number
  title?: string | null
  content?: string | null // text
  content_json?: Record<string, any> // jsonb, default {}
  
  // Video fields
  video_url?: string | null
  video_provider: VideoProvider // integer enum, default 0
  video_identifier?: string | null // Provider-specific ID (YouTube ID, Vimeo ID, etc)
  video_metadata?: Record<string, any> // jsonb, default {}
  
  // Mux specific
  mux_asset_id?: string | null
  mux_playback_id?: string | null
  mux_upload_id?: string | null
  processing_status: ProcessingStatus // integer enum, default 0
  processing_error?: string | null
  
  // Settings
  lesson_type?: LessonType | null // integer enum
  duration_minutes?: number | null
  position?: number | null
  is_free?: boolean | null
  
  // Relations
  course_id: number
  section_id?: number | null
  
  // Timestamps
  created_at: string
  updated_at: string
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
