/**
 * API Services - Barrel Export
 * 
 * Centralized export point for all API services
 * Import services like: import { authService, academyService } from '@/services/api'
 */

export { default as authService, authService as authApi } from './auth-service'
export { default as academyService, academyService as academyApi } from './academy-service'
export { default as academyCategoryService, academyCategoryService as academyCategoryApi } from './academy-category-service'
export { default as courseService, courseService as courseApi } from './course-service'

// Re-export types
export type { 
  AuthUser, 
  AuthResponse, 
  LoginCredentials, 
  RegisterData,
  AcademyData,
  AcademyMembership 
} from './auth-service'

export type { FeaturedAcademy } from './academy-service'

export type { 
  AcademyCategory,
  AcademyCategoryMinimal,
  AcademyCategorySummary
} from './academy-category-service'

export type { FeaturedCourse } from './course-service'