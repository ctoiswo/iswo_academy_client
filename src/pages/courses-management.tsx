import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Plus, Edit, Trash2, BookOpen, Clock, Users, DollarSign, Eye } from 'lucide-react'

import { type Course } from '@/services/course-service'
import { useCourses, useDeleteCourse } from '@/hooks/use-courses'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { CourseForm } from '@/components/courses'

export default function CoursesManagementPage() {
  const { currentAcademy } = useAuthStore()
  const navigate = useNavigate()
  
  // State management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Use hooks
  const academyId = currentAcademy?.id
  const { data: coursesData, isLoading, error } = useCourses(academyId ? Number(academyId) : 0)
  const deleteMutation = useDeleteCourse(academyId ? Number(academyId) : 0)

  // Handle success callbacks
  const handleFormSuccess = () => {
    setIsCreateModalOpen(false)
    setEditingCourse(null)
  }

  // Handle delete
  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      deleteMutation.mutate(courseToDelete.id)
      setCourseToDelete(null)
    }
  }

  // Handle course management navigation
  const handleManageCourse = (course: Course) => {
    // Navigate to course management page
    navigate({ to: `/admin/courses/${course.id}/manage` })
  }

  // Get data
  // Handle both array response and object with data property (same as learning paths)
  const courses = Array.isArray(coursesData) 
    ? coursesData 
    : (coursesData as any)?.data || []
  
  console.log('Courses data:', coursesData)
  console.log('Processed courses:', courses)
  
  // Filter courses
  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    const matchesDifficulty = difficultyFilter === 'all' || course.difficulty_level === difficultyFilter
    const matchesType = typeFilter === 'all' || 
                       (typeFilter === 'free' && course.is_free) ||
                       (typeFilter === 'paid' && !course.is_free)

    return matchesSearch && matchesStatus && matchesDifficulty && matchesType
  })

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Principiante</Badge>
      case 'intermediate':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Intermedio</Badge>
      case 'advanced':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Avanzado</Badge>
      default:
        return <Badge variant="outline">{difficulty}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Publicado</Badge>
      case 'draft':
        return <Badge variant="secondary">Borrador</Badge>
      case 'archived':
        return <Badge variant="outline">Archivado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatPrice = (price: string, isFree: boolean) => {
    if (isFree) {
      return <Badge className="bg-green-100 text-green-800">Gratis</Badge>
    }
    const numPrice = parseFloat(price)
    if (numPrice === 0) {
      return <Badge className="bg-green-100 text-green-800">Gratis</Badge>
    }
    return <Badge variant="outline" className="text-green-600">${numPrice}</Badge>
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    }
    return `${mins}m`
  }

  // No academy selected
  if (!currentAcademy) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay Academia Seleccionada</h3>
          <p className="text-gray-500">Por favor selecciona una academia para gestionar cursos</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-bold text-red-600 mb-2">Error al Cargar Cursos</h3>
          <p className="text-gray-600">Por favor intenta refrescar la página</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Cursos</h1>
          <p className="text-gray-600 mt-2">Crea y gestiona cursos para tu academia</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Curso
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Estados</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="archived">Archivado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Dificultad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Niveles</SelectItem>
            <SelectItem value="beginner">Principiante</SelectItem>
            <SelectItem value="intermediate">Intermedio</SelectItem>
            <SelectItem value="advanced">Avanzado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Tipos</SelectItem>
            <SelectItem value="free">Gratis</SelectItem>
            <SelectItem value="paid">De Pago</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredCourses.length === 0 && courses.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no hay cursos</h3>
          <p className="text-gray-500 mb-6">Crea tu primer curso para comenzar</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Curso
          </Button>
        </div>
      )}

      {/* No Results State */}
      {!isLoading && filteredCourses.length === 0 && courses.length > 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cursos</h3>
          <p className="text-gray-500">Intenta ajustar tu búsqueda o filtros</p>
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && filteredCourses.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course: Course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <div className="flex gap-2 mb-2">
                      {getStatusBadge(course.status)}
                      {getDifficultyBadge(course.difficulty_level)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleManageCourse(course)}
                      title="Gestionar contenido del curso"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingCourse(course)}
                      title="Editar detalles del curso"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCourseToDelete(course)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar curso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(course.duration_minutes)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.enrollment_count} inscritos
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {formatPrice(course.price, course.is_free)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {course.sections_count || 0} secciones, {course.lessons_count || 0} lecciones
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Curso</DialogTitle>
            <DialogDescription>
              Añade un nuevo curso a tu academia
            </DialogDescription>
          </DialogHeader>
          <CourseForm
            academyId={academyId!}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Course Modal */}
      <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Curso</DialogTitle>
            <DialogDescription>
              Actualiza la información del curso
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <CourseForm
              academyId={academyId!}
              course={editingCourse}
              onSuccess={handleFormSuccess}
              onCancel={() => setEditingCourse(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Course Confirmation */}
      <AlertDialog open={!!courseToDelete} onOpenChange={() => setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Curso</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar "{courseToDelete?.title}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar Curso
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}