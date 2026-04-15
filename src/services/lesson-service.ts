import type {
  Lesson,
  LessonUserProgress,
  CreateLessonRequest,
  UpdateLessonRequest,
  VideoUrlResponse,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Lesson Service
 * Handles all lesson-related API calls
 */
class LessonService {
  /**
   * Get all lessons for a section
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @returns Promise with lessons array
   */
  async getLessons(
    academySlug: string,
    courseSlug: string,
    sectionId: number
  ): Promise<Lesson[]> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons`
    )
    // Backend returns { data: [...] }
    return response.data?.data || []
  }

  /**
   * Get a single lesson by ID
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @param lessonId - Lesson ID
   * @returns Promise with lesson details
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
    return (response.data?.data?.lesson ||
      response.data?.lesson ||
      response.data?.data ||
      response.data) as Lesson
  }

  /**
   * Create a new lesson
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @param data - Lesson creation data
   * @returns Promise with created lesson
   */
  async createLesson(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    data: CreateLessonRequest | FormData
  ): Promise<Lesson> {
    // Si es FormData, enviar directamente (ya tiene lesson[campo] en cada key)
    // Si es objeto, envolverlo en { lesson: data }
    const payload = data instanceof FormData ? data : { lesson: data }

    const response = await apiClient.post(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons`,
      payload
    )
    return response.data.data || response.data.lesson
  }

  /**
   * Update an existing lesson
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @param lessonId - Lesson ID
   * @param data - Lesson update data
   * @returns Promise with updated lesson
   */
  async updateLesson(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    lessonId: number,
    data: UpdateLessonRequest | FormData
  ): Promise<Lesson> {
    // Si es FormData, enviar directamente (ya tiene lesson[campo] en cada key)
    // Si es objeto, envolverlo en { lesson: data }
    const payload = data instanceof FormData ? data : { lesson: data }

    const response = await apiClient.patch(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}`,
      payload
    )
    return response.data.data || response.data.lesson
  }

  /**
   * Delete a lesson
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @param lessonId - Lesson ID
   * @returns Promise that resolves when lesson is deleted
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
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @param lessonId - Lesson ID
   * @param position - New position for the lesson
   * @returns Promise with updated lesson
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
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @param lessonId - Lesson ID
   * @returns Promise with video URL and metadata
   */
  async getVideoUrl(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    lessonId: number
  ): Promise<VideoUrlResponse> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/lessons/${lessonId}/video_url`
    )
    return response.data
  }

  /**
   * Mark a lesson as completed for the current user.
   * Uses the direct lesson route (no sectionId needed).
   */
  async completeLesson(
    academySlug: string,
    courseSlug: string,
    lessonId: number
  ): Promise<LessonUserProgress> {
    const response = await apiClient.post(
      `/academies/${academySlug}/courses/${courseSlug}/lessons/${lessonId}/complete`
    )
    return response.data
  }

  /**
   * Track reading/video progress for a lesson.
   * @param timeIncrement - seconds spent reading (for text/document lessons)
   * @param videoPosition - current video position in seconds
   * @param videoDuration - total video duration in seconds
   */
  async trackProgress(
    academySlug: string,
    courseSlug: string,
    lessonId: number,
    payload: {
      time_increment?: number
      video_position?: number
      video_duration?: number
    }
  ): Promise<LessonUserProgress> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/courses/${courseSlug}/lessons/${lessonId}/track_progress`,
      payload
    )
    return response.data
  }
}

// Export singleton instance
const lessonService = new LessonService()
export default lessonService

// Also export as named export
export { lessonService }
