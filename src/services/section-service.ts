import type {
  Section,
  CreateSectionRequest,
  UpdateSectionRequest,
} from '@/types'
import { apiClient } from '@/lib/api-client'

/**
 * Section Service
 * Handles all section-related API calls for courses
 */
class SectionService {
  /**
   * Get all sections for a course
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @returns Promise with sections array
   */
  async getSections(
    academySlug: string,
    courseSlug: string
  ): Promise<Section[]> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/sections`
    )
    return response.data?.sections || []
  }

  /**
   * Get a single section by ID
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @returns Promise with section details
   */
  async getSection(
    academySlug: string,
    courseSlug: string,
    sectionId: number
  ): Promise<Section> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}`
    )
    return response.data.section
  }

  /**
   * Create a new section
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param data - Section creation data
   * @returns Promise with created section
   */
  async createSection(
    academySlug: string,
    courseSlug: string,
    data: CreateSectionRequest
  ): Promise<Section> {
    const response = await apiClient.post(
      `/academies/${academySlug}/courses/${courseSlug}/sections`,
      { section: data }
    )
    return response.data.section
  }

  /**
   * Update an existing section
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @param data - Section update data
   * @returns Promise with updated section
   */
  async updateSection(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    data: UpdateSectionRequest
  ): Promise<Section> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}`,
      { section: data }
    )
    return response.data.section
  }

  /**
   * Delete a section
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @returns Promise that resolves when section is deleted
   */
  async deleteSection(
    academySlug: string,
    courseSlug: string,
    sectionId: number
  ): Promise<void> {
    await apiClient.delete(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}`
    )
  }

  /**
   * Reorder a section
   * @param academySlug - Academy slug
   * @param courseSlug - Course slug
   * @param sectionId - Section ID
   * @param position - New position for the section
   * @returns Promise with updated section
   */
  async reorderSection(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    position: number
  ): Promise<Section> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}/reorder`,
      { position }
    )
    return response.data.section
  }
}

// Export singleton instance
const sectionService = new SectionService()
export default sectionService

// Also export as named export
export { sectionService }
