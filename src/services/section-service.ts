import { apiClient } from '@/lib/api-client'

export interface Section {
  id: number
  course_id: number
  title: string
  description?: string
  position: number
  created_at: string
  updated_at: string
  lessons_count?: number
  duration_minutes?: number
}

export interface CreateSectionData {
  title: string
  description?: string
}

export interface UpdateSectionData {
  title?: string
  description?: string
  position?: number
}

class SectionService {
  /**
   * Get all sections for a course
   */
  async getSections(academySlug: string, courseSlug: string): Promise<Section[]> {
    const response = await apiClient.get(
      `/academies/${academySlug}/courses/${courseSlug}/sections`
    )
    return response.data?.sections || []
  }

  /**
   * Get a single section by ID
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
   */
  async createSection(
    academySlug: string,
    courseSlug: string,
    data: CreateSectionData
  ): Promise<Section> {
    const response = await apiClient.post(
      `/academies/${academySlug}/courses/${courseSlug}/sections`,
      { section: data }
    )
    return response.data.section
  }

  /**
   * Update an existing section
   */
  async updateSection(
    academySlug: string,
    courseSlug: string,
    sectionId: number,
    data: UpdateSectionData
  ): Promise<Section> {
    const response = await apiClient.patch(
      `/academies/${academySlug}/courses/${courseSlug}/sections/${sectionId}`,
      { section: data }
    )
    return response.data.section
  }

  /**
   * Delete a section
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

export const sectionService = new SectionService()
