import { useState, useEffect } from 'react'
import { academyService } from '@/services/academy-service'
import type { AcademySummary } from '@/types'

export function useAcademy(slug: string) {
  const [academy, setAcademy] = useState<AcademySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAcademy = async () => {
      if (!slug) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Decode the slug to handle special characters (ñ, á, etc.)
        const decodedSlug = decodeURIComponent(slug)
        console.log('🔄 Fetching academy with slug:', { original: slug, decoded: decodedSlug })
        
        const academyData = await academyService.getAcademyBySlug(decodedSlug)
        console.log('✅ Academy data received:', academyData)
        setAcademy(academyData)
      } catch (err) {
        console.error('❌ Error fetching academy:', err)
        setError(err instanceof Error ? err.message : 'Error al cargar la academia')
        setAcademy(null)
      } finally {
        setLoading(false)
      }
    }

    fetchAcademy()
  }, [slug])

  const refetch = () => {
    if (slug) {
      const fetchAcademy = async () => {
        try {
          setLoading(true)
          const academyData = await academyService.getAcademyBySlug(slug)
          setAcademy(academyData)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error al cargar la academia')
        } finally {
          setLoading(false)
        }
      }
      fetchAcademy()
    }
  }

  return {
    academy,
    loading,
    error,
    refetch
  }
}

// TODO: Implement useAcademyCourses when the backend endpoint is ready
// export function useAcademyCourses(academySlug: string, options?: {
//   level?: string
//   sortBy?: string
//   limit?: number
// }) {
//   const [courses, setCourses] = useState<Course[]>([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchCourses = async () => {
//       if (!academySlug) return

//       try {
//         setLoading(true)
//         setError(null)

//         const coursesData = await academyService.getAcademyCourses(academySlug, options)
//         setCourses(coursesData)
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Error al cargar los cursos')
//         setCourses([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchCourses()
//   }, [academySlug, options?.level, options?.sortBy, options?.limit])

//   return {
//     courses,
//     loading,
//     error
//   }
// }