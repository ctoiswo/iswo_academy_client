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
export { default as learningPathService, learningPathService as learningPathApi } from './learning-path-service'
export { default as learningPathCoursesService } from './learning-path-courses-service'
export { learningPathCoursesApi } from './learning-path-courses-service'
export { default as learningPathEnrollmentsService } from './learning-path-enrollments-service'
export { default as certificateService, certificateService as certificateApi } from './certificate-service'
export { default as gamificationService, gamificationService as gamificationApi } from './gamification-service'
export { default as superAdminGamificationService, superAdminGamificationService as superAdminGamificationApi } from './super-admin-gamification-service'

// Re-export types
export type {
  AuthUser,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  RegisterResponse,
  AcademyData,
  AcademyMembership
} from './auth-service'

export type {
  FeaturedAcademy,
  FeaturedAcademiesByCategory,
  AcademyCategory as AcademyCategoryFromService
} from './academy-service'

export type {
  AcademyCategory,
  AcademyCategoryMinimal,
  AcademyCategorySummary
} from './academy-category-service'

export type {
  LearningPath,
  Course,
  CreateLearningPathData,
  UpdateLearningPathData,
  LearningPathFilters,
  PaginationMeta,
  LearningPathsResponse,
  LearningPathAnalytics,
  CourseProgress,
  EnrollmentTrend,
  EngagementLevels,
  HighestDropoutCourse
} from './learning-path-service'

export type { FeaturedCourse } from './course-service'

export type {
  Badge,
  UserBadge,
  GamificationProfile,
  LeaderboardEntry,
  BadgeFilters
} from './gamification-service'

export type {
  Certificate,
  CertificateTemplate,
  LearningPathCertificateConfiguration,
  CertificatesResponse
} from './certificate-service'