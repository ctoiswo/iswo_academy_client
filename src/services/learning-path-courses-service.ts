import type { AddCourseToPathRequest, ReorderCoursesRequest } from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Learning Path Courses Service
 * Handles course management within learning paths
 */
class LearningPathCoursesService {
  /**
   * Add a course to a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param courseId - Course ID to add
   * @returns Promise that resolves when course is added
   */
  async addCourse(
    academySlug: string,
    learningPathSlug: string,
    courseId: number
  ): Promise<void> {
    const data: AddCourseToPathRequest = { course_id: courseId }
    await apiClient.post(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/courses`,
      data
    )
  }

  /**
   * Remove a course from a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param courseId - Course ID to remove
   * @returns Promise that resolves when course is removed
   */
  async removeCourse(
    academySlug: string,
    learningPathSlug: string,
    courseId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/courses/${courseId}`
    )
  }

  /**
   * Reorder courses in a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param orderedIds - Array of course IDs in new order
   * @returns Promise that resolves when courses are reordered
   */
  async reorderCourses(
    academySlug: string,
    learningPathSlug: string,
    orderedIds: number[]
  ): Promise<void> {
    const data: ReorderCoursesRequest = { ordered_ids: orderedIds }
    await apiClient.patch(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/courses/reorder`,
      data
    )
  }
}

// Export singleton instance
const learningPathCoursesService = new LearningPathCoursesService()
export default learningPathCoursesService

// Also export as named export
export { learningPathCoursesService }
