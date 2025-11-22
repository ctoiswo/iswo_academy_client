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
   */
  async addCourse(academySlug: string, learningPathSlug: string, courseId: number): Promise<void> {
    console.log('Adding course:', courseId, 'to learning path:', learningPathSlug)
    const response = await apiClient.post(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/courses`,
      { course_id: courseId }
    )
    console.log('Add course response:', response.data)
    return response.data
  }

  /**
   * Remove a course from a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param courseId - Course ID to remove
   */
  async removeCourse(academySlug: string, learningPathSlug: string, courseId: number): Promise<void> {
    console.log('Removing course:', courseId, 'from learning path:', learningPathSlug)
    const response = await apiClient.delete(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/courses/${courseId}`
    )
    console.log('Remove course response:', response.data)
    return response.data
  }

  /**
   * Reorder courses in a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param orderedIds - Array of course IDs in new order
   */
  async reorderCourses(
    academySlug: string,
    learningPathSlug: string,
    orderedIds: number[]
  ): Promise<void> {
    console.log('Reordering courses for learning path:', learningPathSlug, 'with order:', orderedIds)
    const response = await apiClient.patch(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/courses/reorder`,
      { ordered_ids: orderedIds }
    )
    console.log('Reorder courses response:', response.data)
    return response.data
  }
}

const learningPathCoursesService = new LearningPathCoursesService()
export default learningPathCoursesService
export { learningPathCoursesService as learningPathCoursesApi }
