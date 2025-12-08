import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import type { Assignment } from '@/services/assignment-service'
import { CheckSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useAssignments } from '@/hooks/use-assignments'
import { useCourseBySlug } from '@/hooks/use-courses'
import { useLessons } from '@/hooks/use-lessons'
import { useSections } from '@/hooks/use-sections'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AssignmentCard } from '@/components/assignments/assignment-card'
import { CreateAssignmentDialog } from '@/components/assignments/create-assignment-dialog'

export default function CourseAssignmentsPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const { currentAcademy } = useAuthStore()

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'past_due' | 'upcoming'
  >('all')
  const [sectionFilter, setSectionFilter] = useState<string>('all')

  const academyId = currentAcademy?.id
  const {
    data: course,
    isLoading: loadingCourse,
    error: courseError,
  } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)
  const { data: sections = [] } = useSections(academySlug, courseSlug)

  // Get lessons for the first section (for the create dialog)
  const firstSectionId = sections[0]?.id || 0
  const { data: sectionLessons = [] } = useLessons(
    academySlug,
    courseSlug,
    firstSectionId
  )

  // For now, we'll pass lessons from the first section to the dialog
  // In future, we could enhance this to fetch lessons dynamically per section
  const allLessons = sectionLessons

  const assignmentParams = {
    status: statusFilter === 'all' ? undefined : statusFilter,
    section_id: sectionFilter === 'all' ? undefined : Number(sectionFilter),
  }

  const { data: assignments = [], isLoading: loadingAssignments } =
    useAssignments(academySlug, courseSlug, assignmentParams)

  const handleEditAssignment = (assignment: Assignment) => {
    // TODO: Implementar diálogo de edición
    toast.info(
      `Edición de tareas no implementada aún (Asignación ID: ${assignment.id})`
    )
  }

  const handleViewStats = (assignment: Assignment) => {
    // TODO: Implementar diálogo de estadísticas
    toast.info(
      `Estadísticas no implementadas aún (Asignación ID: ${assignment.id})`
    )
  }

  const handleViewSubmissions = (assignment: Assignment) => {
    // TODO: Implementar vista de entregas
    toast.info(
      `Vista de entregas no implementada aún (Asignación ID: ${assignment.id})`
    )
  }

  if (loadingCourse) {
    return (
      <div className='container mx-auto py-8'>
        <Skeleton className='h-64' />
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className='container mx-auto py-8'>
        <div className='py-12 text-center'>
          <h3 className='mb-2 text-lg font-bold text-red-600'>
            Error al Cargar el Curso
          </h3>
          <p className='text-gray-600'>
            Curso no encontrado o no tienes permiso para acceder
          </p>
        </div>
      </div>
    )
  }

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSection =
      sectionFilter === 'all' || assignment.section_id === Number(sectionFilter)
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' &&
        assignment.available &&
        assignment.accepting_submissions) ||
      (statusFilter === 'past_due' && assignment.past_due) ||
      (statusFilter === 'upcoming' && !assignment.available)
    return matchesSection && matchesStatus
  })

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
        <p className='text-gray-600'>
          Crea y gestiona tareas, cuestionarios y proyectos
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
            <div>
              <CardTitle>Tareas del Curso</CardTitle>
              <CardDescription>
                Añade tareas para evaluar el progreso de los estudiantes
              </CardDescription>
            </div>
            <CreateAssignmentDialog
              academySlug={academySlug}
              courseSlug={courseSlug}
              sections={sections}
              lessons={allLessons}
            />
          </div>

          {/* Filtros */}
          {assignments.length > 0 && (
            <div className='mt-4 flex flex-col gap-4 sm:flex-row'>
              <div className='flex-1'>
                <Select
                  value={statusFilter}
                  onValueChange={(value: any) => setStatusFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Filtrar por estado' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Todas las tareas</SelectItem>
                    <SelectItem value='active'>Activas</SelectItem>
                    <SelectItem value='upcoming'>Próximamente</SelectItem>
                    <SelectItem value='past_due'>Vencidas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {sections.length > 0 && (
                <div className='flex-1'>
                  <Select
                    value={sectionFilter}
                    onValueChange={setSectionFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Filtrar por sección' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Todas las secciones</SelectItem>
                      {sections.map((section) => (
                        <SelectItem
                          key={section.id}
                          value={section.id.toString()}
                        >
                          {section.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {loadingAssignments ? (
            <div className='space-y-4'>
              <Skeleton className='h-48' />
              <Skeleton className='h-48' />
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className='py-12 text-center text-gray-500'>
              <CheckSquare className='mx-auto mb-4 h-12 w-12' />
              <h3 className='mb-2 text-lg font-medium'>
                {assignments.length === 0
                  ? 'Aún no hay tareas'
                  : 'No hay tareas que coincidan con los filtros'}
              </h3>
              <p className='mb-4'>
                {assignments.length === 0
                  ? 'Añade tareas para evaluar el progreso de los estudiantes'
                  : 'Intenta cambiar los filtros para ver más tareas'}
              </p>
              {assignments.length === 0 && (
                <CreateAssignmentDialog
                  academySlug={academySlug}
                  courseSlug={courseSlug}
                  sections={sections}
                  lessons={allLessons}
                />
              )}
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  academySlug={academySlug}
                  courseSlug={courseSlug}
                  onEdit={handleEditAssignment}
                  onViewStats={handleViewStats}
                  onViewSubmissions={handleViewSubmissions}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
