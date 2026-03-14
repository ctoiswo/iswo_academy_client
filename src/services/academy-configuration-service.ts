import type { AcademyConfiguration } from '@/types'
import apiClient from '@/lib/api-client'

export interface UpdateFeaturesRequest {
  enable_certificates?: boolean
  enable_discussions?: boolean
  enable_progress_tracking?: boolean
  enable_gamification?: boolean
}

export interface UpdateThemeRequest {
  theme?: AcademyConfiguration['theme']
  primary_color?: string
  secondary_color?: string
  accent_color?: string
  background_color?: string
  text_color?: string
  custom_css?: string
}

export interface UpdateLayoutRequest {
  logo_position?: string
  layout_style?: string
  show_academy_name?: boolean
  show_powered_by?: boolean
}

export interface UpdateSupportRequest {
  support_name?: string
  support_email?: string
  support_phone?: string
  support_hours?: string
  support_url?: string
}

class AcademyConfigurationService {
  /**
   * Get the full configuration for an academy
   * @param academyId - Academy numeric ID (not slug)
   */
  async getConfiguration(academyId: number): Promise<AcademyConfiguration> {
    const response = await apiClient.get(
      `/academies/${academyId}/configuration`
    )
    return response.data.data ?? response.data
  }

  /**
   * Update feature toggles for an academy configuration
   * PATCH /api/v1/academies/:academy_id/configuration/features
   */
  async updateFeatures(
    academyId: number,
    data: UpdateFeaturesRequest
  ): Promise<AcademyConfiguration> {
    const response = await apiClient.patch(
      `/academies/${academyId}/configuration/features`,
      { features: data }
    )
    return response.data.data ?? response.data
  }

  /**
   * Update theme settings
   * PATCH /api/v1/academies/:academy_id/configuration/theme
   */
  async updateTheme(
    academyId: number,
    data: UpdateThemeRequest
  ): Promise<AcademyConfiguration> {
    const response = await apiClient.patch(
      `/academies/${academyId}/configuration/update_theme`,
      { theme: data }
    )
    return response.data.data ?? response.data
  }

  /**
   * Update layout settings
   * PATCH /api/v1/academies/:academy_id/configuration/layout
   */
  async updateLayout(
    academyId: number,
    data: UpdateLayoutRequest
  ): Promise<AcademyConfiguration> {
    const response = await apiClient.patch(
      `/academies/${academyId}/configuration/update_layout`,
      { layout: data }
    )
    return response.data.data ?? response.data
  }

  /**
   * Update support information
   * PATCH /api/v1/academies/:academy_id/configuration/support
   */
  async updateSupport(
    academyId: number,
    data: UpdateSupportRequest
  ): Promise<AcademyConfiguration> {
    const response = await apiClient.patch(
      `/academies/${academyId}/configuration/update_support`,
      { support: data }
    )
    return response.data.data ?? response.data
  }
}

const academyConfigurationService = new AcademyConfigurationService()
export default academyConfigurationService
export { academyConfigurationService }
