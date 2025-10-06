import { useState, useEffect } from 'react'
import { academyService, AcademyDetails, Course } from '@/services/academy'

export function useAcademy(slug: string) {
  const [academy, setAcademy] = useState<AcademyDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAcademy = async () => {
      if (!slug) return

      try {
        setLoading(true)
        setError(null)

        const academyData = await academyService.getAcademyBySlug(slug)
        setAcademy(academyData)
      } catch (err) {
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

export function useAcademyCourses(academySlug: string, options?: {
  level?: string
  sortBy?: string
  limit?: number
}) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      if (!academySlug) return

      try {
        setLoading(true)
        setError(null)

        const coursesData = await academyService.getAcademyCourses(academySlug, options)
        setCourses(coursesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los cursos')
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [academySlug, options?.level, options?.sortBy, options?.limit])

  return {
    courses,
    loading,
    error
  }
}