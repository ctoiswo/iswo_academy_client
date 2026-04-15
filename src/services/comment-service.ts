import type { LessonComment } from '@/types'
import apiClient from '@/lib/api-client'

class CommentService {
  async getLessonComments(
    lessonId: number,
    page = 1
  ): Promise<{ comments: LessonComment[]; total: number }> {
    const response = await apiClient.get(`/lessons/${lessonId}/comments`, {
      params: { page, per_page: 20 },
    })
    const data = response.data
    return {
      comments: data.data ?? [],
      total: data.meta?.total ?? data.data?.length ?? 0,
    }
  }

  async createLessonComment(
    lessonId: number,
    body: string,
    parentId?: number
  ): Promise<LessonComment> {
    const response = await apiClient.post(`/lessons/${lessonId}/comments`, {
      comment: { body, parent_id: parentId ?? null },
    })
    return response.data.data ?? response.data
  }

  async updateComment(commentId: number, body: string): Promise<LessonComment> {
    const response = await apiClient.patch(`/comments/${commentId}`, {
      comment: { body },
    })
    return response.data.data ?? response.data
  }

  async deleteComment(commentId: number): Promise<void> {
    await apiClient.delete(`/comments/${commentId}`)
  }
}

const commentService = new CommentService()
export default commentService
export { commentService }
