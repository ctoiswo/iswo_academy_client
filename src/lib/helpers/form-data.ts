import type { AcademyFormData } from '@/types'

/**
 * Converts AcademyFormData to FormData for multipart/form-data uploads
 * Used when creating or updating academies with file attachments (logo, banner)
 * 
 * @param data - Academy form data including File objects
 * @returns FormData ready to send to API
 * 
 * @example
 * ```typescript
 * const formData = academyToFormData({
 *   name: 'My Academy',
 *   description: 'A great academy',
 *   banner: bannerFile,
 *   logo: logoFile
 * })
 * 
 * await fetch('/api/v1/academies', {
 *   method: 'POST',
 *   body: formData
 * })
 * ```
 */
export function academyToFormData(data: AcademyFormData): FormData {
  const formData = new FormData()

  // Text fields
  if (data.name) formData.append('academy[name]', data.name)
  if (data.description) formData.append('academy[description]', data.description)
  if (data.slug) formData.append('academy[slug]', data.slug)
  if (data.website_url) formData.append('academy[website_url]', data.website_url)
  if (data.mission) formData.append('academy[mission]', data.mission)
  if (data.vision) formData.append('academy[vision]', data.vision)

  // Boolean fields
  formData.append('academy[is_public]', String(data.is_public))
  formData.append('academy[subscription_required]', String(data.subscription_required))

  // Numeric fields
  formData.append('academy[monthly_price]', String(data.monthly_price))
  if (data.academy_category_id) {
    formData.append('academy[academy_category_id]', String(data.academy_category_id))
  }

  // File uploads
  if (data.logo) {
    formData.append('academy[logo]', data.logo)
  }
  if (data.banner) {
    formData.append('academy[banner]', data.banner)
  }

  return formData
}

/**
 * Validates file size and type for academy uploads
 * @param file - File to validate
 * @param type - Type of upload ('logo' or 'banner')
 * @returns Validation error message or null if valid
 */
export function validateAcademyFile(
  file: File,
  type: 'logo' | 'banner'
): string | null {
  const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 5 * 1024 * 1024 // 2MB for logo, 5MB for banner
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (file.size > maxSize) {
    return `${type === 'logo' ? 'Logo' : 'Banner'} debe ser menor a ${maxSize / 1024 / 1024}MB`
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Solo se permiten imágenes (JPEG, PNG, WebP)'
  }

  return null
}
