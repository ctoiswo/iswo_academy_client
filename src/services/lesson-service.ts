import { apiClient } from '@/lib/api-client'

export interface Lesson {
  id: number
  course_id: number
  section_id: number
  title: string
  content?: string
  content_json?: Record<string, any>
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment' | 'interactive' | 'document'
  video_provider?: 'none' | 'youtube' | 'vimeo' | 'google_drive' | 's3_direct' | 'bunny_cdn'
  video_identifier?: string
  video_url?: string
  video_metadata?: Record<string, any>
  duration_minutes?: number
  position: number
  is_free: boolean
  processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
  processing_error?: string
  created_at: string
  updated_at: string
  mux_playback_id?: string
  mux_asset_id?: string
}

export interface CreateLessonData {
  title: string
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment' | 'interactive' | 'document'
  content?: string
  content_json?: Record<string, any>
  video_provider?: 'none' | 'youtube' | 'vimeo' | 'google_drive' | 's3_direct' | 'bunny_cdn'
  video_identifier?: string
  video_url?: string
  duration_minutes?: number
  is_free?: boolean
}

export interface UpdateLessonData extends Partial<CreateLessonData> {
  position?: number
}

class LessonService {
  /**
   * Get all lessons for a section
   */
  async getLessons(
    academySlug: string,
    courseSlug: string,
    sectionId: number
  ): Promise<Lesson[]> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons`
    )
    return response.data?.lessons || []
  }

  /**
   * Get a single lesson by ID
   */
  async getLesson(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    lessonId: number
  ): Promise<Lesson> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`
    )
    return response.data.lesson
  }

  /**
   * Create a new lesson
   */
  async createLesson(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    data: CreateLessonData
  ): Promise<Lesson> {
    const response = await apiClient.post(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons`,
      { lesson: data }
    )
    return response.data.lesson
  }

  /**
   * Update an existing lesson
   */
  async updateLesson(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    lessonId: number,
    data: UpdateLessonData
  ): Promise<Lesson> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`,
      { lesson: data }
    )
    return response.data.lesson
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    lessonId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`
    )
  }

  /**
   * Reorder a lesson
   */
  async reorderLesson(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    lessonId: number,
    position: number
  ): Promise<Lesson> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}/reorder`,
      { position }
    )
    return response.data.lesson
  }

  /**
   * Get video URL for a lesson (requires enrollment)
   */
  async getVideoUrl(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    lessonId: number
  ): Promise<{ video_url: string; provider: string; expires_at: string }> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}/video_url`
    )
    return response.data
  }
}

export const lessonService = new LessonService()
