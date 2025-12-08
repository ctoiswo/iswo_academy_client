/**
 * Form related types
 */

// Generic form state
export interface FormState<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  isSubmitting: boolean
  isValid: boolean
}

// Form field error
export interface FieldError {
  message: string
  type?: string
}

// Category form
export interface CategoryFormData {
  name: string
  slug?: string
  description?: string
  icon?: string
  color?: string
}

// Settings form (example)
export interface SettingsFormValues {
  title: string
  description: string
  difficulty_level: string
  price?: number
  is_free: boolean
  is_published: boolean
}
