import { apiClient } from '@/lib/api-client'

export interface Notification {
  id: number
  notification_type: string
  category: 'academic' | 'social' | 'administrative' | 'system'
  priority: 1 | 2 | 3 | 4
  title: string
  body: string
  action_url?: string
  action_text?: string
  read: boolean
  read_at?: string
  archived: boolean
  created_at: string
  expires_at?: string
  metadata?: Record<string, any>
  actor?: {
    id: number
    full_name: string
    avatar_url?: string
  }
  notifiable?: {
    type: string
    id: number
  }
}

export interface NotificationsResponse {
  data: Notification[]
  meta: {
    current_page: number
    total_pages: number
    total_count: number
    unread_count: number
  }
}

export interface NotificationStats {
  total: number
  unread: number
  by_category: {
    academic: number
    social: number
    administrative: number
    system: number
  }
  by_priority: {
    critical: number
    high: number
    normal: number
    low: number
  }
}

class NotificationService {
  /**
   * Get all notifications with pagination and filters
   */
  async getNotifications(params?: {
    page?: number
    per_page?: number
    filter?: 'unread' | 'read' | 'all'
    category?: string
  }): Promise<NotificationsResponse> {
    const response = await apiClient.get('/notifications', { params })
    return response.data
  }

  /**
   * Get only unread notifications
   */
  async getUnreadNotifications(): Promise<{
    data: Notification[]
    meta: { count: number }
  }> {
    const response = await apiClient.get('/notifications/unread')
    return response.data
  }

  /**
   * Get a single notification by ID
   */
  async getNotification(id: number): Promise<{ data: Notification }> {
    const response = await apiClient.get(`/notifications/${id}`)
    return response.data
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(
    id: number
  ): Promise<{ data: Notification; message: string }> {
    const response = await apiClient.patch(`/notifications/${id}/mark_as_read`)
    return response.data
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(
    academyId?: number
  ): Promise<{ message: string; count: number }> {
    const response = await apiClient.patch('/notifications/mark_all_as_read', {
      academy_id: academyId,
    })
    return response.data
  }

  /**
   * Archive (soft delete) a notification
   */
  async archiveNotification(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete(`/notifications/${id}`)
    return response.data
  }

  /**
   * Get notification statistics
   */
  async getStats(academyId?: number): Promise<{ data: NotificationStats }> {
    const response = await apiClient.get('/notifications/stats', {
      params: { academy_id: academyId },
    })
    return response.data
  }
}

export const notificationService = new NotificationService()
