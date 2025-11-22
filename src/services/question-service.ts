import apiClient from '@/lib/api-client'
import type { Question, Answer, QuestionType } from './assessment-service'

export interface CreateQuestionData {
  question_text: string
  question_type: QuestionType
  points: number
  explanation?: string
  answers: Array<{
    answer_text: string
    is_correct: boolean
  }>
}

export interface UpdateQuestionData extends Partial<CreateQuestionData> {}

class QuestionService {
  async getQuestions(
    academySlug: string,
    courseSlug: string,
    assessmentId: number
  ): Promise<Question[]> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions`
    )
    return response.data
  }

  async getQuestion(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    questionId: number
  ): Promise<Question> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions/${questionId}`
    )
    return response.data
  }

  async createQuestion(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    data: CreateQuestionData
  ): Promise<Question> {
    const response = await apiClient.post(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions`,
      { question: data, answers: data.answers }
    )
    return response.data
  }

  async updateQuestion(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    questionId: number,
    data: UpdateQuestionData
  ): Promise<Question> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions/${questionId}`,
      { question: data, answers: data.answers }
    )
    return response.data
  }

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

  async reorderQuestion(
    academySlug: string,
    courseSlug: string,
    assessmentId: number,
    questionId: number,
    position: number
  ): Promise<Question> {
    const response = await apiClient.post(
      `/academies/${academySlug}/courses/${courseSlug}/assessments/${assessmentId}/questions/${questionId}/reorder`,
      { position }
    )
    return response.data
  }
}

export const questionService = new QuestionService()
export type { Question, Answer, QuestionType }
