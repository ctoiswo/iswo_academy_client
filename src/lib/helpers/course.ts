/**
 * Course Helper Functions
 */

/**
 * Generate a URL-friendly slug from course data
 * @param course - Course object with slug, title, and id
 * @returns Generated or existing slug
 * @example
 * generateCourseSlug({ slug: 'my-course', title: 'My Course', id: 1 }) // "my-course"
 * generateCourseSlug({ title: 'JavaScript Basics', id: 42 }) // "javascript-basics-42"
 */
export function generateCourseSlug(course: {
  slug?: string
  title: string
  id: number
}): string {
  if (course.slug) return course.slug

  // Generate slug from title and id
  const titleSlug = course.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  return `${titleSlug}-${course.id}`
}

/**
 * Calculate course duration in hours and minutes
 * @param durationMinutes - Duration in minutes
 * @returns Formatted duration string
 * @example
 * formatCourseDuration(90) // "1h 30m"
 * formatCourseDuration(45) // "45m"
 */
export function formatCourseDuration(durationMinutes: number): string {
  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

/**
 * Get course progress percentage
 * @param completedLessons - Number of completed lessons
 * @param totalLessons - Total number of lessons
 * @returns Progress percentage
 */
export function getCourseProgress(
  completedLessons: number,
  totalLessons: number
): number {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}

/**
 * Check if a course is completed
 * @param completedLessons - Number of completed lessons
 * @param totalLessons - Total number of lessons
 * @returns True if course is completed
 */
export function isCourseCompleted(
  completedLessons: number,
  totalLessons: number
): boolean {
  return totalLessons > 0 && completedLessons >= totalLessons
}

/**
 * Get estimated reading time for course description
 * @param text - Text content
 * @param wordsPerMinute - Reading speed (default: 200)
 * @returns Estimated minutes
 */
export function getEstimatedReadingTime(
  text: string,
  wordsPerMinute: number = 200
): number {
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}
