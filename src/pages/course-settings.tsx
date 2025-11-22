import { useParams, Link } from '@tanstack/react-router'
import { ArrowLeft, Settings } from 'lucide-react'
import { useCourseBySlug } from '@/hooks/use-courses'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function CourseSettingsPage() {
  const params = useParams({ strict: false }) as { academySlug: string; courseSlug: string }
  const { academySlug, courseSlug } = params
  const { currentAcademy } = useAuthStore()
  
  const academyId = currentAcademy?.id
  const { data: course, isLoading, error } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-64" />
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-gray-600">Ajustes avanzados y configuración del curso</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Curso</CardTitle>
            <CardDescription>
              Ajustes avanzados y configuración del curso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Visibilidad y Acceso</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Estado de Publicación</p>
                    <p className="text-sm text-gray-600">Controla si el curso es visible para estudiantes</p>
                  </div>
                  <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                    {course.status === 'published' ? 'Publicado' : 'Borrador'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Tipo de Acceso</p>
                    <p className="text-sm text-gray-600">Controla cómo los estudiantes acceden al curso</p>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    {course.is_free ? 'Gratis' : 'Pago'}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Opciones del Curso</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Certificado de Finalización</p>
                    <p className="text-sm text-gray-600">Otorgar certificado al completar</p>
                  </div>
                  <Badge variant="outline">
                    {course.has_certificate ? 'Activado' : 'Desactivado'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Inscripción</p>
                    <p className="text-sm text-gray-600">Permitir que estudiantes se inscriban</p>
                  </div>
                  <Badge variant="outline">
                    {course.enrollment_enabled !== false ? 'Abierta' : 'Cerrada'}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Editar Configuración
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Zona de Peligro</CardTitle>
            <CardDescription>
              Acciones irreversibles del curso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium">Archivar Curso</p>
                <p className="text-sm text-gray-600">El curso no será visible pero se conservarán los datos</p>
              </div>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Archivar
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium">Eliminar Curso</p>
                <p className="text-sm text-gray-600">Eliminar permanentemente el curso y todo su contenido</p>
              </div>
              <Button variant="destructive">
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
