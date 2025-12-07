/**
 * Central export point for all types
 * Import types from here: import { Academy, Course, User } from '@/types'
 */

// Common types
export * from './common'

// Entity types
export * from './entities/user'
export * from './entities/category'
export * from './entities/academy'
export * from './entities/course'
export * from './entities/lesson'
export * from './entities/assignment'
export * from './entities/assessment'
export * from './entities/wishlist'
export * from './entities/badge'
export * from './entities/statistics'
export * from './entities/access-code'
export * from './entities/certificate'
export * from './entities/enrollment'
export * from './entities/gamification'
export * from './entities/learning-path-enrollment'
export * from './entities/learning-path'
export * from './entities/user-profile'
export * from './entities/student-assignment'
export * from './entities/super-admin-gamification'

// API types
export * from './api/responses'
export * from './api/requests'
export * from './api/search'
export * from './api/filters'

// UI types
export * from './ui/forms'
export * from './ui/navigation'
