import type { AcademyCategory } from '@/services/academy-category-service'

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

// Type for minimal academy data from backend
type MinimalAcademy = {
  id: number
  name: string
  slug: string
  monthly_price: string
}

export function adaptBackendAcademyToCard(academy: MinimalAcademy, categoryName: string): AcademyCardData {
  // Parse the price safely
  const price = parseFloat(academy.monthly_price) || 0
  
  return {
    id: academy.id,
    name: academy.name,
    slug: academy.slug,
    description: 'Descripción no disponible', // No disponible en la vista minimal
    instructor: 'Instructor', // No disponible en la vista minimal
    students: 0, // No disponible en la vista minimal
    rating: 4.5, // Default rating hasta que el backend lo provea
    courses: 0, // No disponible en la vista minimal
    // Imagen placeholder hasta que el backend provea imágenes
    image: `https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2`,
    category: categoryName,
    duration: undefined, // No disponible en el backend aún
    level: undefined, // No disponible en el backend aún  
    price: price
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