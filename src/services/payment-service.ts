import apiClient from '@/lib/api-client'
import type { AdminSubscriptionPlanCode } from '@/constants/admin-subscription-plans'

interface CoursePurchaseResponse {
  data: {
    payment_id: number
    checkout_url: string
    preference_id: string
    public_key: string
    amount: number
    currency: string
    course_id: number
    subscription_type: string
    lifetime: boolean
  }
}

interface AcademySubscriptionResponse {
  data: {
    payment_id: number
    checkout_url: string
    amount: number
    currency: string
    academy_id: number
    subscription_type: string
    expires_at: string
  }
}

interface AdminSubscriptionResponse {
  data: {
    payment_id: number
    checkout_url: string
    amount: number
    currency: string
    academy_id: number
    subscription_type: string
    expires_at: string
  }
}

class PaymentService {
  /**
   * Initiates a course purchase via MercadoPago Checkout Pro.
   * Returns a checkout_url to redirect the user to MercadoPago.
   */
  async createCoursePurchase(courseId: number): Promise<CoursePurchaseResponse> {
    const response = await apiClient.post<CoursePurchaseResponse>(
      '/payments/course_purchase',
      { course_id: courseId }
    )
    return response.data
  }

  /**
   * Initiates an academy membership purchase via MercadoPago Checkout Pro.
   */
  async createAcademySubscription(
    academyId: number
  ): Promise<AcademySubscriptionResponse> {
    const response = await apiClient.post<AcademySubscriptionResponse>(
      '/payments/academy_subscription',
      { academy_id: academyId }
    )
    return response.data
  }

  /**
   * Initiates the academy owner's annual admin subscription via MercadoPago Checkout Pro.
   */
  async createAdminSubscription(
    academyId: number,
    planCode: AdminSubscriptionPlanCode
  ): Promise<AdminSubscriptionResponse> {
    const response = await apiClient.post<AdminSubscriptionResponse>(
      '/payments/admin_subscription',
      { academy_id: academyId, plan_code: planCode }
    )
    return response.data
  }
}

export const paymentService = new PaymentService()
export default paymentService
