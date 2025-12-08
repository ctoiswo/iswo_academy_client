import { useEffect, useState } from 'react'
import {
  Code,
  Briefcase,
  Globe,
  Palette,
  Microscope,
  Heart,
  Music,
  GraduationCap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface AcademyCategory {
  id: number
  name: string
  description: string
  slug: string
  icon: string
  color: string
  academies_count: number
  academies: Academy[]
}

interface Academy {
  id: number
  name: string
  description: string
  slug: string
  monthly_price: number
  subscription_required: boolean
  creator: {
    id: number
    name: string
  } | null
  courses_count: number
  enrolled_users_count: number
}

// Mapeo de iconos
const iconMap = {
  Code,
  Briefcase,
  Globe,
  Palette,
  Microscope,
  Heart,
  Music,
  GraduationCap,
}

export function AcademiesPage() {
  const [categories, setCategories] = useState<AcademyCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/v1/academy_categories'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data.categories)
      } catch (_err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Skeleton className='mb-4 h-8 w-64' />
        <Skeleton className='mb-8 h-4 w-96' />
        <div className='grid gap-6'>
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className='mb-4 h-6 w-48' />
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className='h-48' />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <Card className='mx-auto max-w-md'>
          <CardHeader>
            <CardTitle className='text-red-600'>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className='mt-4 w-full'
            >
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='mb-2 text-4xl font-bold'>Academias Disponibles</h1>
        <p className='text-muted-foreground text-lg'>
          Descubre cursos organizados por categorías y comienza tu viaje de
          aprendizaje
        </p>
      </div>

      <div className='space-y-12'>
        {categories.map((category) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap]

          return (
            <section key={category.id} className='space-y-6'>
              {/* Header de Categoría */}
              <div className='flex items-center gap-3'>
                {IconComponent && (
                  <div
                    className='rounded-lg p-2'
                    style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                    }}
                  >
                    <IconComponent className='h-6 w-6' />
                  </div>
                )}
                <div>
                  <h2 className='text-2xl font-semibold'>{category.name}</h2>
                  <p className='text-muted-foreground'>
                    {category.description}
                  </p>
                </div>
                <Badge variant='secondary' className='ml-auto'>
                  {category.academies_count} academias
                </Badge>
              </div>

              {/* Academias de la categoría */}
              {category.academies_count > 0 ? (
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                  {category.academies.map((academy) => (
                    <AcademyCard
                      key={academy.id}
                      academy={academy}
                      categoryColor={category.color}
                    />
                  ))}
                </div>
              ) : (
                <Card className='p-8 text-center'>
                  <p className='text-muted-foreground'>
                    Pronto habrá academias disponibles en esta categoría
                  </p>
                </Card>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}

interface AcademyCardProps {
  academy: Academy
  categoryColor: string
}

function AcademyCard({ academy, categoryColor }: AcademyCardProps) {
  return (
    <Card className='group transition-shadow duration-200 hover:shadow-lg'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='mb-1 text-lg'>{academy.name}</CardTitle>
            <p className='text-muted-foreground line-clamp-2 text-sm'>
              {academy.description}
            </p>
          </div>
          <div
            className='ml-3 h-12 w-2 rounded-full'
            style={{ backgroundColor: categoryColor }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-3'>
          {/* Información del creador */}
          {academy.creator && (
            <div className='text-muted-foreground text-sm'>
              Por {academy.creator.name}
            </div>
          )}

          {/* Estadísticas */}
          <div className='flex gap-4 text-sm'>
            <span className='text-muted-foreground'>
              {academy.courses_count} cursos
            </span>
            <span className='text-muted-foreground'>
              {academy.enrolled_users_count} estudiantes
            </span>
          </div>

          {/* Precio y botón */}
          <div className='flex items-center justify-between pt-2'>
            <div>
              {academy.subscription_required ? (
                <Badge variant='default'>${academy.monthly_price}/mes</Badge>
              ) : (
                <Badge variant='secondary'>Gratis</Badge>
              )}
            </div>
            <Button size='sm' className='group-hover:bg-primary/90'>
              Ver Academia
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
