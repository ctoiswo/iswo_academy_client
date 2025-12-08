import type { Academy } from '@/types'

/**
 * Genera un slug único para una academia
 * @param name - Nombre de la academia
 * @returns Slug generado
 * @example
 * generateAcademySlug('Academia de Desarrollo Web') // 'academia-de-desarrollo-web'
 */
export function generateAcademySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Agrupa academias por categoría
 * @param academies - Array de academias
 * @returns Objeto con academias agrupadas por slug de categoría
 */
export function groupAcademiesByCategory(academies: any[]) {
  return academies.reduce(
    (acc, academy) => {
      const categoryName = academy.academy_category?.name || 'Sin categoría'
      const categorySlug = academy.academy_category?.slug || 'sin-categoria'

      if (!acc[categorySlug]) {
        acc[categorySlug] = {
          id: academy.academy_category?.id || 0,
          name: categoryName,
          slug: categorySlug,
          academies: [],
        }
      }

      acc[categorySlug].academies.push({
        id: academy.id,
        name: academy.name,
        slug: academy.slug,
        description: academy.description,
        banner_url: academy.banner_url,
        monthly_price: academy.monthly_price,
        enrolled_users_count: academy.enrolled_users_count,
        courses_count: academy.courses_count,
      })

      return acc
    },
    {} as Record<string, any>
  )
}

/**
 * Verifica si una academia es gratuita
 * @param academy - Academia a verificar
 * @returns true si la academia es gratuita
 */
export function isAcademyFree(academy: Academy): boolean {
  return !academy.monthly_price || parseFloat(academy.monthly_price.toString()) === 0
}

/**
 * Obtiene la URL del banner de una academia o un fallback
 * @param academy - Academia
 * @returns URL del banner
 */
export function getAcademyBannerUrl(academy: Academy): string {
  return academy.banner_url || '/images/academy-placeholder.jpg'
}

/**
 * Formatea el conteo de estudiantes para mostrar
 * @param count - Número de estudiantes
 * @returns String formateado (ej: '1.2K', '500')
 */
export function formatStudentCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

/**
 * Formatea el conteo de cursos para mostrar
 * @param count - Número de cursos
 * @returns String formateado con texto (ej: '5 cursos', '1 curso')
 */
export function formatCourseCount(count: number): string {
  return `${count} ${count === 1 ? 'curso' : 'cursos'}`
}
