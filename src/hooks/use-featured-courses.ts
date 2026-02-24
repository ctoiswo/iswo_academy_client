import { useQuery } from '@tanstack/react-query'
import { courseService } from '@/services/course-service'
import type { LandingCourse } from '@/types/pages/home'
import type { CategoryWithCourses } from '@/types'

/**
 * Convert duration_minutes to a human-readable "Xh Ym" string.
 * Backend stores duration in minutes; the UI shows hours (e.g. "42h" or "1h 30m").
 */
function formatDuration(minutes: number | undefined | null): string {
  if (!minutes) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

/**
 * Format a price number to a display string.
 * Free courses show "Gratis", paid courses show "$X".
 */
function formatPrice(price: number | undefined | null, isFree: boolean, currency = 'USD'): string {
  if (isFree || !price || price === 0) return 'Gratis'
  // Use currency symbol map for common currencies
  const symbols: Record<string, string> = { USD: '$', EUR: '€', MXN: '$' }
  const symbol = symbols[currency] ?? currency + ' '
  return `${symbol}${price}`
}

/**
 * Map a backend Course (summary view) to the LandingCourse shape used by the UI.
 */
function mapToLandingCourse(course: CategoryWithCourses['courses'][number]): LandingCourse {
  // Sum lessons_count across all sections when total_lessons is not directly available
  const totalLessons =
    course.total_lessons ??
    course.sections_summary?.reduce((acc, s) => acc + s.lessons_count, 0) ??
    0

  return {
    id: String(course.id),
    title: course.title,
    description: course.description,
    instructor: course.creator?.name ?? '—',
    category: course.category ?? course.academy?.name ?? '',
    duration: formatDuration(course.duration_minutes),
    totalLessons,
    rating: course.average_rating ?? 0,
    students: course.enrollment_count ?? 0,
    price: formatPrice(course.price, course.is_free, course.currency),
    thumbnailUrl: course.promotional_image_url ?? course.thumbnail_url ?? undefined,
    slug: course.slug,
  }
}

/**
 * Fetches featured courses from the backend and returns them as a flat
 * LandingCourse array, ready to be rendered by CoursesSection.
 */
export function useFeaturedCourses() {
  return useQuery<LandingCourse[]>({
    queryKey: ['courses', 'featured'],
    queryFn: async () => {
      const categories = await courseService.getFeaturedCourses()
      // The API returns [{ category, courses[] }, ...] — flatten to a single list
      return categories.flatMap((item) => item.courses.map(mapToLandingCourse))
    },
    staleTime: 1000 * 60 * 5, // 5 minutes — landing page data doesn't change often
    gcTime: 1000 * 60 * 10,
  })
}
