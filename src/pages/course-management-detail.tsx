import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
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
  Key,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  Ticket,
  FileQuestion,
  Info
} from 'lucide-react'

import { useCourseBySlug } from '@/hooks/use-courses'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { AccessCodeList } from '@/components/access-codes/access-code-list'

export default function CourseManagementDetailPage() {
  const params = useParams({ strict: false }) as { academySlug: string; courseSlug: string }
  const { academySlug, courseSlug } = params
  const { currentAcademy } = useAuthStore()
  
  // Fetch course data by slug
  const academyId = currentAcademy?.id
  const { data: course, isLoading, error } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)

  // Tab state
  const [activeTab, setActiveTab] = useState('info')

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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/academy/${academySlug}/courses`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Cursos
            </Button>
          </Link>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold">{course.title}</h1>
                  <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="h-6">
                    {course.status === 'published' ? 'Publicado' : course.status === 'draft' ? 'Borrador' : 'Archivado'}
                  </Badge>
                </div>
                <p className="text-gray-600 text-base mb-4">{course.description}</p>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {course.difficulty_level === 'beginner' ? '📘 Principiante' : 
                     course.difficulty_level === 'intermediate' ? '📙 Intermedio' : '📕 Avanzado'}
                  </Badge>
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    {course.is_free ? '🎁 Gratis' : `💰 $${course.price}`}
                  </Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    ⏱️ {Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m
                  </Badge>
                </div>
              </div>
              <Button onClick={() => setActiveTab('settings')} variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Estudiantes</p>
                <p className="text-3xl font-bold">{course.enrollment_count || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Lecciones</p>
                <p className="text-3xl font-bold">{course.lessons_count || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Duración Total</p>
                <p className="text-3xl font-bold">
                  {Math.floor(course.duration_minutes / 60)}
                  <span className="text-lg text-gray-600">h</span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Secciones</p>
                <p className="text-3xl font-bold">{course.sections_count || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="info">
            <Info className="w-4 h-4 mr-2" />
            Información
          </TabsTrigger>
          <TabsTrigger value="lessons">
            <PlayCircle className="w-4 h-4 mr-2" />
            Lecciones
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <CheckSquare className="w-4 h-4 mr-2" />
            Tareas
          </TabsTrigger>
          <TabsTrigger value="exams">
            <FileQuestion className="w-4 h-4 mr-2" />
            Exámenes
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="w-4 h-4 mr-2" />
            Estudiantes
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <Award className="w-4 h-4 mr-2" />
            Certificados
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        {/* Info Tab */}
        <TabsContent value="info">
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
        </TabsContent>

        {/* Lessons Tab */}
        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Lecciones del Curso</CardTitle>
                  <CardDescription>
                    Gestiona lecciones, secciones y contenido del curso
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Lección
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <PlayCircle className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">Aún no hay lecciones</h3>
                <p className="mb-4">Comienza a construir tu curso añadiendo lecciones y secciones</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Lección
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tareas del Curso</CardTitle>
                  <CardDescription>
                    Crea y gestiona tareas, cuestionarios y proyectos
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Tarea
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <CheckSquare className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">Aún no hay tareas</h3>
                <p className="mb-4">Añade tareas para evaluar el progreso de los estudiantes</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Tarea
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Exámenes del Curso</CardTitle>
                  <CardDescription>
                    Crea y gestiona exámenes y quizzes para evaluar conocimientos
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Examen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <FileQuestion className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">Aún no hay exámenes</h3>
                <p className="mb-4">Crea exámenes para evaluar el aprendizaje de los estudiantes</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Examen
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Estudiantes Inscritos</CardTitle>
                  <CardDescription>
                    Ver y gestionar estudiantes inscritos en este curso
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Ver Análisis
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {course.enrollment_count === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay estudiantes inscritos</h3>
                  <p className="mb-4">Los estudiantes aparecerán aquí una vez se inscriban al curso</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {course.enrollment_count} estudiante{course.enrollment_count !== 1 ? 's' : ''} inscrito{course.enrollment_count !== 1 ? 's' : ''}
                  </p>
                  {/* TODO: Add student list component */}
                  <div className="text-center py-8 text-gray-500">
                    <p>Interfaz de gestión de estudiantes próximamente...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Certificados del Curso</CardTitle>
                  <CardDescription>
                    Configura los certificados de finalización y requisitos
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
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}