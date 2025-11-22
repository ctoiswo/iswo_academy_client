import apiClient from '@/lib/api-client'

// TypeScript interfaces for Certificates
export interface Certificate {
  id: number
  certificate_number: string
  verification_code: string
  issued_at: string
  revoked_at: string | null
  is_active: boolean
  user: {
    id: number
    full_name: string
    email: string
  }
  verification_url: string | null
  created_at: string
}

export interface CertificateTemplate {
  id: number
  name: string
  is_default: boolean
  is_active: boolean
  content: Record<string, any>
  design: Record<string, any>
}

export interface LearningPathCertificateConfiguration {
  certificate_enabled: boolean
  certificate_template: CertificateTemplate | null
  learning_path: {
    id: number
    title: string
    description: string
    estimated_duration_hours: number
    courses_count: number
  }
  academy: {
    id: number
    name: string
    slug: string
  }
  statistics: {
    total_issued: number
    active_certificates: number
    revoked_certificates: number
  }
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total_pages: number
  total_count: number
}

export interface CertificatesResponse {
  data: Certificate[]
  meta: PaginationMeta
}

/**
 * Certificate Service
 * Handles all certificate-related API calls
 */
class CertificateService {
  /**
   * Get certificate configuration for a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @returns Promise with certificate configuration
   */
  async getLearningPathCertificateConfiguration(
    academySlug: string,
    learningPathSlug: string
  ): Promise<LearningPathCertificateConfiguration> {
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/certificates/configuration`
    )
    return response.data.data
  }

  /**
   * Update certificate configuration for a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param certificateEnabled - Whether certificates are enabled
   * @returns Promise with updated configuration
   */
  async updateLearningPathCertificateConfiguration(
    academySlug: string,
    learningPathSlug: string,
    certificateEnabled: boolean
  ): Promise<{ certificate_enabled: boolean; message: string }> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/certificates/configuration`,
      {
        learning_path: {
          certificate_enabled: certificateEnabled,
        },
      }
    )
    return response.data.data
  }

  /**
   * Get issued certificates for a learning path
   * @param academySlug - Academy slug
   * @param learningPathSlug - Learning path slug
   * @param page - Page number
   * @param perPage - Items per page
   * @returns Promise with issued certificates
   */
  async getLearningPathCertificates(
    academySlug: string,
    learningPathSlug: string,
    page: number = 1,
    perPage: number = 25
  ): Promise<CertificatesResponse> {
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/certificates`,
      {
        params: { page, per_page: perPage },
      }
    )
    return response.data
  }
}

// Export singleton instance
const certificateService = new CertificateService()
export default certificateService

// Also export as named export
export { certificateService }
