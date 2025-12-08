import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  Award,
  CheckSquare,
  Users,
  Settings,
  Plus,
  PlayCircle,
  Clock,
  Target,
  FileQuestion,
  Info,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useCourseBySlug } from '@/hooks/use-courses'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AccessCodeList } from '@/components/access-codes/access-code-list'

export default function CourseManagementDetailPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const { currentAcademy } = useAuthStore()

  // Fetch course data by slug
  const academyId = currentAcademy?.id
  const {
    data: course,
    isLoading,
    error,
  } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)

  // Tab state
  const [activeTab, setActiveTab] = useState('info')

  if (isLoading) {
    return (
      <div className='container mx-auto py-8'>
        <div className='space-y-6'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-32' />
          <Skeleton className='h-64' />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='container mx-auto py-8'>
        <div className='py-12 text-center'>
          <h3 className='mb-2 text-lg font-bold text-red-600'>
            Error al Cargar el Curso
          </h3>
          <p className='text-gray-600'>
            Curso no encontrado o no tienes permiso para acceder
          </p>
          <a
            href={`/academy/${academySlug}/courses`}
            className='mt-4 inline-block'
          >
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver a Cursos
            </Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='mb-6 flex items-center gap-4'>
          <a href={`/academy/${academySlug}/courses`}>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver a Cursos
            </Button>
          </a>
        </div>

        <Card>
          <CardHeader>
            <div className='flex items-start justify-between'>
              <div className='flex-1'>
                <div className='mb-3 flex items-center gap-3'>
                  <h1 className='text-3xl font-bold'>{course.title}</h1>
                  <Badge
                    variant={
                      course.status === 'published' ? 'default' : 'secondary'
                    }
                    className='h-6'
                  >
                    {course.status === 'published'
                      ? 'Publicado'
                      : course.status === 'draft'
                        ? 'Borrador'
                        : 'Archivado'}
                  </Badge>
                </div>
                <p className='mb-4 text-base text-gray-600'>
                  {course.description}
                </p>
                <div className='flex gap-2'>
                  <Badge variant='outline'>
                    {course.difficulty_level === 'beginner'
                      ? '📘 Principiante'
                      : course.difficulty_level === 'intermediate'
                        ? '📙 Intermedio'
                        : '📕 Avanzado'}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='border-green-200 bg-green-50 text-green-600'
                  >
                    {course.is_free ? '🎁 Gratis' : `💰 $${course.price}`}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='border-blue-200 bg-blue-50 text-blue-600'
                  >
                    ⏱️ {Math.floor(course.duration_minutes / 60)}h{' '}
                    {course.duration_minutes % 60}m
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => setActiveTab('settings')}
                variant='outline'
              >
                <Settings className='mr-2 h-4 w-4' />
                Configuración
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Course Stats */}
      <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card className='transition-shadow hover:shadow-md'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-1 text-sm font-medium text-gray-600'>
                  Estudiantes
                </p>
                <p className='text-3xl font-bold'>
                  {course.enrollment_count || 0}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='transition-shadow hover:shadow-md'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-1 text-sm font-medium text-gray-600'>
                  Lecciones
                </p>
                <p className='text-3xl font-bold'>
                  {course.lessons_count || 0}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                <PlayCircle className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='transition-shadow hover:shadow-md'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-1 text-sm font-medium text-gray-600'>
                  Duración Total
                </p>
                <p className='text-3xl font-bold'>
                  {Math.floor(course.duration_minutes / 60)}
                  <span className='text-lg text-gray-600'>h</span>
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-orange-100'>
                <Clock className='h-6 w-6 text-orange-600' />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='transition-shadow hover:shadow-md'>
          <CardContent className='pt-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-1 text-sm font-medium text-gray-600'>
                  Secciones
                </p>
                <p className='text-3xl font-bold'>
                  {course.sections_count || 0}
                </p>
              </div>
              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-purple-100'>
                <BookOpen className='h-6 w-6 text-purple-600' />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-6'
      >
        <TabsList className='grid w-full grid-cols-7'>
          <TabsTrigger value='info'>
            <Info className='mr-2 h-4 w-4' />
            Información
          </TabsTrigger>
          <TabsTrigger value='lessons'>
            <PlayCircle className='mr-2 h-4 w-4' />
            Lecciones
          </TabsTrigger>
          <TabsTrigger value='assignments'>
            <CheckSquare className='mr-2 h-4 w-4' />
            Tareas
          </TabsTrigger>
          <TabsTrigger value='exams'>
            <FileQuestion className='mr-2 h-4 w-4' />
            Exámenes
          </TabsTrigger>
          <TabsTrigger value='students'>
            <Users className='mr-2 h-4 w-4' />
            Estudiantes
          </TabsTrigger>
          <TabsTrigger value='certificates'>
            <Award className='mr-2 h-4 w-4' />
            Certificados
          </TabsTrigger>
          <TabsTrigger value='settings'>
            <Settings className='mr-2 h-4 w-4' />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value='info'>
          <div className='grid gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Información General del Curso</CardTitle>
                <CardDescription>
                  Detalles básicos y configuración del curso
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-2 gap-6'>
                  <div>
                    <h4 className='mb-1 text-sm font-medium text-gray-600'>
                      Título
                    </h4>
                    <p className='text-base'>{course.title}</p>
                  </div>
                  <div>
                    <h4 className='mb-1 text-sm font-medium text-gray-600'>
                      Estado
                    </h4>
                    <Badge
                      variant={
                        course.status === 'published' ? 'default' : 'secondary'
                      }
                    >
                      {course.status === 'published'
                        ? 'Publicado'
                        : course.status === 'draft'
                          ? 'Borrador'
                          : 'Archivado'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className='mb-1 text-sm font-medium text-gray-600'>
                    Descripción
                  </h4>
                  <p className='text-base text-gray-700'>
                    {course.description}
                  </p>
                </div>

                <div className='grid grid-cols-3 gap-6'>
                  <div>
                    <h4 className='mb-1 text-sm font-medium text-gray-600'>
                      Nivel de Dificultad
                    </h4>
                    <Badge variant='outline'>
                      {course.difficulty_level === 'beginner'
                        ? 'Principiante'
                        : course.difficulty_level === 'intermediate'
                          ? 'Intermedio'
                          : 'Avanzado'}
                    </Badge>
                  </div>
                  <div>
                    <h4 className='mb-1 text-sm font-medium text-gray-600'>
                      Precio
                    </h4>
                    <p className='text-base font-semibold text-green-600'>
                      {course.is_free ? 'Gratis' : `$${course.price}`}
                    </p>
                  </div>
                  <div>
                    <h4 className='mb-1 text-sm font-medium text-gray-600'>
                      Duración Estimada
                    </h4>
                    <p className='text-base'>
                      {Math.floor(course.duration_minutes / 60)}h{' '}
                      {course.duration_minutes % 60}m
                    </p>
                  </div>
                </div>

                {course.thumbnail_url && (
                  <div>
                    <h4 className='mb-2 text-sm font-medium text-gray-600'>
                      Miniatura
                    </h4>
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className='w-full max-w-md rounded-lg border'
                    />
                  </div>
                )}

                <div className='border-t pt-4'>
                  <Button className='w-full'>
                    <Settings className='mr-2 h-4 w-4' />
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
                <AccessCodeList courseSlug={course.slug} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Access Codes Tab */}
        <TabsContent value='access-codes'>
          <AccessCodeList courseSlug={course.slug} />
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value='lessons'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Lecciones del Curso</CardTitle>
                  <CardDescription>
                    Gestiona lecciones, secciones y contenido del curso
                  </CardDescription>
                </div>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Añadir Lección
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='py-12 text-center text-gray-500'>
                <PlayCircle className='mx-auto mb-4 h-12 w-12' />
                <h3 className='mb-2 text-lg font-medium'>
                  Aún no hay lecciones
                </h3>
                <p className='mb-4'>
                  Comienza a construir tu curso añadiendo lecciones y secciones
                </p>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Crear Primera Lección
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value='assignments'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Tareas del Curso</CardTitle>
                  <CardDescription>
                    Crea y gestiona tareas, cuestionarios y proyectos
                  </CardDescription>
                </div>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Añadir Tarea
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='py-12 text-center text-gray-500'>
                <CheckSquare className='mx-auto mb-4 h-12 w-12' />
                <h3 className='mb-2 text-lg font-medium'>Aún no hay tareas</h3>
                <p className='mb-4'>
                  Añade tareas para evaluar el progreso de los estudiantes
                </p>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Crear Primera Tarea
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value='exams'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Exámenes del Curso</CardTitle>
                  <CardDescription>
                    Crea y gestiona exámenes y quizzes para evaluar
                    conocimientos
                  </CardDescription>
                </div>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Añadir Examen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='py-12 text-center text-gray-500'>
                <FileQuestion className='mx-auto mb-4 h-12 w-12' />
                <h3 className='mb-2 text-lg font-medium'>
                  Aún no hay exámenes
                </h3>
                <p className='mb-4'>
                  Crea exámenes para evaluar el aprendizaje de los estudiantes
                </p>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Crear Primer Examen
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value='students'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Estudiantes Inscritos</CardTitle>
                  <CardDescription>
                    Ver y gestionar estudiantes inscritos en este curso
                  </CardDescription>
                </div>
                <Button variant='outline'>
                  <Target className='mr-2 h-4 w-4' />
                  Ver Análisis
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {course.enrollment_count === 0 ? (
                <div className='py-12 text-center text-gray-500'>
                  <Users className='mx-auto mb-4 h-12 w-12' />
                  <h3 className='mb-2 text-lg font-medium'>
                    No hay estudiantes inscritos
                  </h3>
                  <p className='mb-4'>
                    Los estudiantes aparecerán aquí una vez se inscriban al
                    curso
                  </p>
                </div>
              ) : (
                <div className='space-y-4'>
                  <p className='text-sm text-gray-600'>
                    {course.enrollment_count} estudiante
                    {course.enrollment_count !== 1 ? 's' : ''} inscrito
                    {course.enrollment_count !== 1 ? 's' : ''}
                  </p>
                  {/* TODO: Add student list component */}
                  <div className='py-8 text-center text-gray-500'>
                    <p>Interfaz de gestión de estudiantes próximamente...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value='certificates'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Certificados del Curso</CardTitle>
                  <CardDescription>
                    Configura los certificados de finalización y requisitos
                  </CardDescription>
                </div>
                <Button>
                  <Plus className='mr-2 h-4 w-4' />
                  Configurar Certificado
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='py-12 text-center text-gray-500'>
                <Award className='mx-auto mb-4 h-12 w-12' />
                <h3 className='mb-2 text-lg font-medium'>
                  No hay certificado configurado
                </h3>
                <p className='mb-4'>
                  Configura certificados de finalización para estudiantes que
                  completen el curso
                </p>
                <Button>
                  <Award className='mr-2 h-4 w-4' />
                  Configurar Certificado
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value='settings'>
          <div className='grid gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Configuración del Curso</CardTitle>
                <CardDescription>
                  Ajustes avanzados y configuración del curso
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div>
                  <h4 className='mb-3 text-sm font-medium'>
                    Visibilidad y Acceso
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div>
                        <p className='font-medium'>Estado de Publicación</p>
                        <p className='text-sm text-gray-600'>
                          Controla si el curso es visible para estudiantes
                        </p>
                      </div>
                      <Badge
                        variant={
                          course.status === 'published'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {course.status === 'published'
                          ? 'Publicado'
                          : 'Borrador'}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div>
                        <p className='font-medium'>Tipo de Acceso</p>
                        <p className='text-sm text-gray-600'>
                          Controla cómo los estudiantes acceden al curso
                        </p>
                      </div>
                      <Badge variant='outline' className='text-green-600'>
                        {course.is_free ? 'Gratis' : 'Pago'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className='mb-3 text-sm font-medium'>
                    Opciones del Curso
                  </h4>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div>
                        <p className='font-medium'>
                          Certificado de Finalización
                        </p>
                        <p className='text-sm text-gray-600'>
                          Otorgar certificado al completar
                        </p>
                      </div>
                      <Badge variant='outline'>
                        {course.certificate_enabled ? 'Activado' : 'Desactivado'}
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between rounded-lg border p-3'>
                      <div>
                        <p className='font-medium'>Inscripción</p>
                        <p className='text-sm text-gray-600'>
                          Permitir que estudiantes se inscriban
                        </p>
                      </div>
                      <Badge variant='outline'>
                        {course.status === 'published'
                          ? 'Abierta'
                          : 'Cerrada'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className='border-t pt-4'>
                  <Button className='w-full'>
                    <Settings className='mr-2 h-4 w-4' />
                    Editar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className='border-red-200'>
              <CardHeader>
                <CardTitle className='text-red-600'>Zona de Peligro</CardTitle>
                <CardDescription>
                  Acciones irreversibles del curso
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center justify-between rounded-lg border border-red-200 p-3'>
                  <div>
                    <p className='font-medium'>Archivar Curso</p>
                    <p className='text-sm text-gray-600'>
                      El curso no será visible pero se conservarán los datos
                    </p>
                  </div>
                  <Button
                    variant='outline'
                    className='border-red-200 text-red-600 hover:bg-red-50'
                  >
                    Archivar
                  </Button>
                </div>
                <div className='flex items-center justify-between rounded-lg border border-red-200 p-3'>
                  <div>
                    <p className='font-medium'>Eliminar Curso</p>
                    <p className='text-sm text-gray-600'>
                      Eliminar permanentemente el curso y todo su contenido
                    </p>
                  </div>
                  <Button variant='destructive'>Eliminar</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
