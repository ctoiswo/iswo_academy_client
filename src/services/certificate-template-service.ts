import type {
  CertificateTemplate,
  CreateCertificateTemplateRequest,
  UpdateCertificateTemplateRequest,
} from '@/types'
import apiClient from '@/lib/api-client'

/**
 * Certificate Template Service
 * Handles all certificate template-related API calls
 */
class CertificateTemplateService {
  /**
   * Get all templates for an academy
   * @param academySlug - Academy slug
   * @returns Promise with array of certificate templates
   */
  async getAcademyTemplates(
    academySlug: string
  ): Promise<CertificateTemplate[]> {
    const response = await apiClient.get(
      `/academies/${academySlug}/certificate_templates`
    )
    return response.data.data || response.data.certificate_templates || []
  }

  /**
   * Get a single template
   * @param academySlug - Academy slug
   * @param templateId - Template ID
   * @returns Promise with certificate template details
   */
  async getTemplate(
    academySlug: string,
    templateId: number
  ): Promise<CertificateTemplate> {
    const response = await apiClient.get(
      `/academies/${academySlug}/certificate_templates/${templateId}`
    )
    return response.data.data || response.data.certificate_template
  }

  /**
   * Create a new certificate template
   * @param academySlug - Academy slug
   * @param data - Template data (with optional files)
   * @returns Promise with created template
   */
  async createTemplate(
    academySlug: string,
    data: CreateCertificateTemplateRequest
  ): Promise<CertificateTemplate> {
    const formData = new FormData()

    formData.append('certificate_template[name]', data.name)
    if (data.description)
      formData.append('certificate_template[description]', data.description)
    if (data.is_default !== undefined) {
      formData.append(
        'certificate_template[is_default]',
        String(data.is_default)
      )
    }

    // Design
    formData.append('certificate_template[design]', JSON.stringify(data.design))

    // Content
    formData.append(
      'certificate_template[content]',
      JSON.stringify(data.content)
    )

    // Requirements
    if (data.requirements) {
      formData.append(
        'certificate_template[requirements]',
        JSON.stringify(data.requirements)
      )
    }

    // Files
    if (data.background_image) {
      formData.append(
        'certificate_template[background_image]',
        data.background_image
      )
    }
    if (data.logo) {
      formData.append('certificate_template[logo]', data.logo)
    }

    const response = await apiClient.post(
      `/academies/${academySlug}/certificate_templates`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data || response.data.certificate_template
  }

  /**
   * Update an existing certificate template
   * @param academySlug - Academy slug
   * @param templateId - Template ID
   * @param data - Updated template data (with optional files)
   * @returns Promise with updated template
   */
  async updateTemplate(
    academySlug: string,
    templateId: number,
    data: UpdateCertificateTemplateRequest
  ): Promise<CertificateTemplate> {
    const formData = new FormData()

    if (data.name) formData.append('certificate_template[name]', data.name)
    if (data.description)
      formData.append('certificate_template[description]', data.description)
    if (data.is_default !== undefined) {
      formData.append(
        'certificate_template[is_default]',
        String(data.is_default)
      )
    }

    if (data.design) {
      formData.append(
        'certificate_template[design]',
        JSON.stringify(data.design)
      )
    }

    if (data.content) {
      formData.append(
        'certificate_template[content]',
        JSON.stringify(data.content)
      )
    }

    if (data.requirements) {
      formData.append(
        'certificate_template[requirements]',
        JSON.stringify(data.requirements)
      )
    }

    if (data.background_image) {
      formData.append(
        'certificate_template[background_image]',
        data.background_image
      )
    }
    if (data.logo) {
      formData.append('certificate_template[logo]', data.logo)
    }

    const response = await apiClient.patch(
      `/academies/${academySlug}/certificate_templates/${templateId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data || response.data.certificate_template
  }

  /**
   * Delete a certificate template
   * @param academySlug - Academy slug
   * @param templateId - Template ID
   * @returns Promise that resolves when template is deleted
   */
  async deleteTemplate(academySlug: string, templateId: number): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/certificate_templates/${templateId}`
    )
  }

  /**
   * Set a template as the default for the academy
   * @param academySlug - Academy slug
   * @param templateId - Template ID
   * @returns Promise with updated template
   */
  async setAsDefault(
    academySlug: string,
    templateId: number
  ): Promise<CertificateTemplate> {
    const response = await apiClient.post(
      `/academies/${academySlug}/certificate_templates/${templateId}/set_default`
    )
    return response.data.data || response.data.certificate_template
  }

  /**
   * Get HTML preview of a template
   * @param academySlug - Academy slug
   * @param templateId - Template ID
   * @returns Promise with HTML preview
   */
  async getPreview(
    academySlug: string,
    templateId: number
  ): Promise<{ html: string }> {
    const response = await apiClient.get(
      `/academies/${academySlug}/certificate_templates/${templateId}/preview`
    )
    return response.data
  }

  /**
   * Trigger async preview PDF generation for a template
   * @param academySlug - Academy slug
   * @param templateId - Template ID
   * @returns Promise with server message
   */
  async generatePreviewPdf(
    academySlug: string,
    templateId: number
  ): Promise<{ message: string }> {
    const response = await apiClient.post(
      `/academies/${academySlug}/certificate_templates/${templateId}/generate_preview_pdf`
    )
    return response.data
  }
}

// Export singleton instance
const certificateTemplateService = new CertificateTemplateService()
export default certificateTemplateService

// Also export as named export
export { certificateTemplateService }
