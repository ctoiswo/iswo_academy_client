import { Academy as BackendAcademy, AcademyCategory } from '@/services/academy-categories'

// Interfaz esperada por CategoryCarousel y PublicAcademyCard
export interface AcademyCardData {
  id: number
  name: string
  slug: string
  description: string
  instructor: string
  students: number
  rating: number
  courses: number
  image: string
  category: string
  duration?: string
  level?: 'Principiante' | 'Intermedio' | 'Avanzado'
  price?: number
}

export function adaptBackendAcademyToCard(academy: BackendAcademy, categoryName: string): AcademyCardData {
  return {
    id: academy.id,
    name: academy.name,
    slug: academy.slug,
    description: academy.description,
    instructor: academy.creator?.name || 'Instructor no disponible',
    students: academy.enrolled_users_count,
    rating: 4.5, // Default rating hasta que el backend lo provea
    courses: academy.courses_count,
    // Imagen placeholder hasta que el backend provea imágenes
    image: `https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2`,
    category: categoryName,
    duration: undefined, // No disponible en el backend aún
    level: undefined, // No disponible en el backend aún  
    price: academy.subscription_required ? academy.monthly_price : 0
  }
}

export function adaptCategoryForCarousel(category: AcademyCategory): {
  title: string
  academies: AcademyCardData[]
} {
  return {
    title: category.name,
    academies: category.academies.map(academy =>
      adaptBackendAcademyToCard(academy, category.name)
    )
  }
}