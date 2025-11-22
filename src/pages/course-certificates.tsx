import { useParams, Link } from '@tanstack/react-router'
import { ArrowLeft, Plus, Award } from 'lucide-react'
import { useCourseBySlug } from '@/hooks/use-courses'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function CourseCertificatesPage() {
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
        <p className="text-gray-600">Configura los certificados de finalización y requisitos</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Certificados del Curso</CardTitle>
              <CardDescription>
                Define los certificados que obtendrán los estudiantes al completar el curso
              </CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Configurar Certificado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Award className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay certificado configurado</h3>
            <p className="mb-4">Configura certificados de finalización para estudiantes que completen el curso</p>
            <Button>
              <Award className="w-4 h-4 mr-2" />
              Configurar Certificado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
