/**
 * API Services - Barrel Export
 *
 * Centralized export point for all API services
 * Import services like: import { authService, academyService } from '@/services'
 *
 * Note: All types have been moved to @/types for centralized management.
 * Import types from @/types instead of from individual services.
 */

export { default as authService, authService as authApi } from './auth-service'
export {
  default as academyService,
  academyService as academyApi,
} from './academy-service'
export {
  default as academyCategoryService,
  academyCategoryService as academyCategoryApi,
} from './academy-category-service'
export {
  default as courseService,
  courseService as courseApi,
} from './course-service'
export {
  default as learningPathService,
  learningPathService as learningPathApi,
} from './learning-path-service'
export {
  default as learningPathCoursesService,
  learningPathCoursesService as learningPathCoursesApi,
} from './learning-path-courses-service'
export { default as learningPathEnrollmentsService } from './learning-path-enrollments-service'
export {
  default as certificateService,
  certificateService as certificateApi,
} from './certificate-service'
export {
  default as gamificationService,
  gamificationService as gamificationApi,
} from './gamification-service'
export {
  default as superAdminGamificationService,
  superAdminGamificationService as superAdminGamificationApi,
} from './super-admin-gamification-service'
export {
  default as enrollmentService,
  enrollmentService as enrollmentApi,
} from './enrollment-service'
export {
  default as sectionService,
  sectionService as sectionApi,
} from './section-service'
export {
  default as lessonService,
  lessonService as lessonApi,
} from './lesson-service'
export {
  default as profileService,
  profileService as profileApi,
} from './profile-service'
export {
  default as questionService,
  questionService as questionApi,
} from './question-service'
export {
  default as studentAssignmentService,
  studentAssignmentService as studentAssignmentApi,
} from './student-assignment-service'
export {
  default as wishlistService,
  wishlistService as wishlistApi,
} from './wishlist-service'
export {
  default as certificateTemplateService,
  certificateTemplateService as certificateTemplateApi,
} from './certificate-template-service'

// Re-export service-specific response types that are still in services
export type {
  FeaturedAcademiesByCategory,
  UserAcademiesResponse,
} from './academy-service'

export {
  default as statsService,
  statsService as statsApi,
} from './stats-service'
