import { apiClient } from '@/lib/api-client'

export interface CertificateTemplate {
  id: number
  academy_id: number
  name: string
  description: string | null
  is_default: boolean
  is_active: boolean
  usage_count: number
  design: {
    layout: 'portrait' | 'landscape'
    background_color: string
    border_style: 'classic' | 'minimal' | 'modern' | 'none'
    font_family: string
    logo_position: 'top-left' | 'top-center' | 'top-right'
    signature_count: number
  }
  content: {
    title: string
    subtitle: string
    body: string
    footer: string
    signatures: Array<{
      title: string
      name_placeholder: string
    }>
  }
  requirements: {
    lessons_completion?: number
    minimum_score?: number
  }
  background_image_url?: string
  logo_url?: string
  created_at: string
  updated_at: string
}

export interface CreateCertificateTemplateData {
  name: string
  description?: string
  is_default?: boolean
  design: {
    layout: 'portrait' | 'landscape'
    background_color: string
    border_style: string
    font_family: string
    logo_position: string
    signature_count: number
  }
  content: {
    title: string
    subtitle: string
    body: string
    footer: string
    signatures: Array<{
      title: string
      name_placeholder: string
    }>
  }
  requirements?: {
    lessons_completion?: number
    minimum_score?: number
  }
  background_image?: File
  logo?: File
}

export interface UpdateCertificateTemplateData extends Partial<CreateCertificateTemplateData> {}

const certificateTemplateService = {
  // Get all templates for an academy
  getAcademyTemplates: async (academySlug: string): Promise<CertificateTemplate[]> => {
    const response = await apiClient.get(`/academies/${academySlug}/certificate_templates`)
    return response.data.data || response.data.certificate_templates || []
  },

  // Get single template
  getTemplate: async (academySlug: string, templateId: number): Promise<CertificateTemplate> => {
    const response = await apiClient.get(`/academies/${academySlug}/certificate_templates/${templateId}`)
    return response.data.data || response.data.certificate_template
  },

  // Create template
  createTemplate: async (
    academySlug: string,
    data: CreateCertificateTemplateData
  ): Promise<CertificateTemplate> => {
    const formData = new FormData()
    
    formData.append('certificate_template[name]', data.name)
    if (data.description) formData.append('certificate_template[description]', data.description)
    if (data.is_default !== undefined) {
      formData.append('certificate_template[is_default]', String(data.is_default))
    }
    
    // Design
    formData.append('certificate_template[design]', JSON.stringify(data.design))
    
    // Content
    formData.append('certificate_template[content]', JSON.stringify(data.content))
    
    // Requirements
    if (data.requirements) {
      formData.append('certificate_template[requirements]', JSON.stringify(data.requirements))
    }
    
    // Files
    if (data.background_image) {
      formData.append('certificate_template[background_image]', data.background_image)
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
  },

  // Update template
  updateTemplate: async (
    academySlug: string,
    templateId: number,
    data: UpdateCertificateTemplateData
  ): Promise<CertificateTemplate> => {
    const formData = new FormData()
    
    if (data.name) formData.append('certificate_template[name]', data.name)
    if (data.description) formData.append('certificate_template[description]', data.description)
    if (data.is_default !== undefined) {
      formData.append('certificate_template[is_default]', String(data.is_default))
    }
    
    if (data.design) {
      formData.append('certificate_template[design]', JSON.stringify(data.design))
    }
    
    if (data.content) {
      formData.append('certificate_template[content]', JSON.stringify(data.content))
    }
    
    if (data.requirements) {
      formData.append('certificate_template[requirements]', JSON.stringify(data.requirements))
    }
    
    if (data.background_image) {
      formData.append('certificate_template[background_image]', data.background_image)
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
  },

  // Delete template
  deleteTemplate: async (academySlug: string, templateId: number): Promise<void> => {
    await apiClient.delete(`/academies/${academySlug}/certificate_templates/${templateId}`)
  },

  // Set as default
  setAsDefault: async (academySlug: string, templateId: number): Promise<CertificateTemplate> => {
    const response = await apiClient.post(
      `/academies/${academySlug}/certificate_templates/${templateId}/set_default`
    )
    return response.data.data || response.data.certificate_template
  },

  // Get preview
  getPreview: async (academySlug: string, templateId: number): Promise<{ html: string }> => {
    const response = await apiClient.get(
      `/academies/${academySlug}/certificate_templates/${templateId}/preview`
    )
    return response.data
  },
}

export default certificateTemplateService
