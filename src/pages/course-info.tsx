import { useParams, Link } from '@tanstack/react-router'
import { ArrowLeft, Settings, Info } from 'lucide-react'
import { useCourseBySlug } from '@/hooks/use-courses'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AccessCodeList } from '@/components/access-codes/access-code-list'

export default function CourseInfoPage() {
  const params = useParams({ strict: false }) as { academySlug: string; courseSlug: string }
  const { academySlug, courseSlug } = params
  const { currentAcademy } = useAuthStore()
  
  const academyId = currentAcademy?.id
  const { data: course, isLoading, error } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-bold text-red-600 mb-2">Error al Cargar el Curso</h3>
          <p className="text-gray-600">Curso no encontrado o no tienes permiso para acceder</p>
          <Link to={`/academy/${academySlug}/courses`} className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Cursos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-gray-600">Información general del curso</p>
        </div>
        <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="h-7">
          {course.status === 'published' ? 'Publicado' : course.status === 'draft' ? 'Borrador' : 'Archivado'}
        </Badge>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información General del Curso</CardTitle>
            <CardDescription>
              Detalles básicos y configuración del curso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Título</h4>
                <p className="text-base">{course.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Estado</h4>
                <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                  {course.status === 'published' ? 'Publicado' : course.status === 'draft' ? 'Borrador' : 'Archivado'}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">Descripción</h4>
              <p className="text-base text-gray-700">{course.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Nivel de Dificultad</h4>
                <Badge variant="outline">
                  {course.difficulty_level === 'beginner' ? 'Principiante' : 
                   course.difficulty_level === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Precio</h4>
                <p className="text-base font-semibold text-green-600">
                  {course.is_free ? 'Gratis' : `$${course.price}`}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-1">Duración Estimada</h4>
                <p className="text-base">
                  {Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m
                </p>
              </div>
            </div>

            {course.thumbnail_url && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Miniatura</h4>
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title}
                  className="w-full max-w-md rounded-lg border"
                />
              </div>
            )}

            <div className="pt-4 border-t">
              <Button className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Editar Información del Curso
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Códigos de Acceso</CardTitle>
            <CardDescription>
              Gestiona los códigos de acceso para este curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccessCodeList courseId={course.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
