import type {
  Certificate,
  CertificateVerification,
  CertificateDownloadData,
  CourseCertificateStatus,
  LearningPathCertificateConfiguration,
  PaginationMeta,
  MessageResponse,
} from '@/types'
import apiClient from '@/lib/api-client'

export interface CertificatesResponse {
  certificates: Certificate[]
  pagination: PaginationMeta
}

export interface CertificateFilters {
  course_id?: number
  user_id?: number
  page?: number
  per_page?: number
}

/**
 * Certificate Service
 * Handles all certificate-related API calls
 */
class CertificateService {
  /**
   * Get all certificates (user's own or all if super admin)
   * @param filters - Optional filters (course_id, user_id, pagination)
   * @returns Promise with certificates and pagination
   */
  async getCertificates(
    filters?: CertificateFilters
  ): Promise<CertificatesResponse> {
    const response = await apiClient.get<CertificatesResponse>(
      '/certificates',
      {
        params: filters,
      }
    )
    return response.data
  }

  /**
   * Get a single certificate
   * @param certificateId - Certificate ID
   * @returns Promise with certificate details
   */
  async getCertificate(certificateId: number): Promise<Certificate> {
    const response = await apiClient.get<{ certificate: Certificate }>(
      `/certificates/${certificateId}`
    )
    return response.data.certificate
  }

  /**
   * Create a certificate for a completed course
   * @param courseId - Course ID
   * @returns Promise with created certificate
   */
  async createCertificate(courseId: number): Promise<Certificate> {
    const response = await apiClient.post<{ certificate: Certificate }>(
      '/certificates',
      {
        course_id: courseId,
      }
    )
    return response.data.certificate
  }

  /**
   * Download certificate (get template data for PDF generation)
   * @param certificateId - Certificate ID
   * @returns Promise with certificate download data
   */
  async downloadCertificate(
    certificateId: number
  ): Promise<CertificateDownloadData> {
    const response = await apiClient.get<CertificateDownloadData>(
      `/certificates/${certificateId}/download`
    )
    return response.data
  }

  /**
   * Verify a certificate by certificate number
   * @param certificateNumber - Certificate number to verify
   * @returns Promise with verification result
   */
  async verifyCertificate(
    certificateNumber: string
  ): Promise<CertificateVerification> {
    const response = await apiClient.get<CertificateVerification>(
      `/certificates/verify/${certificateNumber}`
    )
    return response.data
  }

  /**
   * Revoke a certificate
   * @param certificateId - Certificate ID
   * @returns Promise with success message
   */
  async revokeCertificate(certificateId: number): Promise<MessageResponse> {
    const response = await apiClient.patch<MessageResponse>(
      `/certificates/${certificateId}/revoke`
    )
    return response.data
  }

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
    config: {
      certificateEnabled: boolean
      certificateTemplateId?: number | null
    }
  ): Promise<{ certificate_enabled: boolean; message: string }> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/certificates/configuration`,
      {
        learning_path: {
          certificate_enabled: config.certificateEnabled,
          certificate_template_id: config.certificateTemplateId ?? null,
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
  ): Promise<{ data: Certificate[]; meta: PaginationMeta }> {
    const response = await apiClient.get(
      `/academies/${academySlug}/learning_paths/${learningPathSlug}/certificates`,
      {
        params: { page, per_page: perPage },
      }
    )
    return response.data
  }

  /**
   * Get current user's certificate status for a specific academy course
   */
  async getCourseCertificateStatus(
    academySlug: string,
    courseSlug: string
  ): Promise<CourseCertificateStatus> {
    const response = await apiClient.get<CourseCertificateStatus>(
      `/academies/${academySlug}/courses/${courseSlug}/certificate_status`
    )
    return response.data
  }
}

// Export singleton instance
const certificateService = new CertificateService()
export default certificateService

// Also export as named export
export { certificateService }
