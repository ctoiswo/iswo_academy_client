import type {
  Question,
  CreateQuestionRequest,
  UpdateQuestionRequest,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Question Service
 * Handles all question-related API calls for assessments
 */
class QuestionService {
  /**
   * Get all questions for an assessment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @returns Promise with questions array
   */
  async getQuestions(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<Question[]> {
    const response = await apiClient.get<{ data: Question[] }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions`
    )
    return response.data?.data || []
  }

  /**
   * Get a single question by ID
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @param questionId - Question ID
   * @returns Promise with question details
   */
  async getQuestion(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    questionId: number
  ): Promise<Question> {
    const response = await apiClient.get<{ data: Question }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions/${questionId}`
    )
    return response.data.data
  }

  /**
   * Create a new question for an assessment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @param data - Question creation data
   * @returns Promise with created question
   */
  async createQuestion(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    data: CreateQuestionRequest
  ): Promise<Question> {
    const response = await apiClient.post<{ data: Question }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions`,
      { question: data, answers: data.answers }
    )
    return response.data.data
  }

  /**
   * Update an existing question
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @param questionId - Question ID
   * @param data - Question update data
   * @returns Promise with updated question
   */
  async updateQuestion(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    questionId: number,
    data: UpdateQuestionRequest
  ): Promise<Question> {
    const response = await apiClient.patch<{ data: Question }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions/${questionId}`,
      { question: data, answers: data.answers }
    )
    return response.data.data
  }

  /**
   * Delete a question
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @param questionId - Question ID
   * @returns Promise that resolves when question is deleted
   */
  async deleteQuestion(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    questionId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions/${questionId}`
    )
  }

  /**
   * Reorder a question within an assessment
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param assessmentId - Assessment ID
   * @param questionId - Question ID
   * @param position - New position for the question
   * @returns Promise with updated question
   */
  async reorderQuestion(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    questionId: number,
    position: number
  ): Promise<Question> {
    const response = await apiClient.post<{ data: Question }>(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions/${questionId}/reorder`,
      { position }
    )
    return response.data.data
  }
}

// Export singleton instance
const questionService = new QuestionService()
export default questionService

// Also export as named export
export { questionService }
