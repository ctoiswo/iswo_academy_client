import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import type { Assignment } from '@/services/assignment-service'
import { es } from 'date-fns/locale'
import {
  MoreVertical,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Calendar,
  FileText,
} from 'lucide-react'
import { useDeleteAssignment } from '@/hooks/use-assignments'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AssignmentCardProps {
  assignment: Assignment
  academySlug: string
  courseSlug: string
  onEdit: (assignment: Assignment) => void
  onViewStats: (assignment: Assignment) => void
  onViewSubmissions: (assignment: Assignment) => void
}

export function AssignmentCard({
  assignment,
  academySlug,
  courseSlug,
  onEdit,
  onViewStats,
  onViewSubmissions,
}: AssignmentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const deleteAssignment = useDeleteAssignment(academySlug, courseSlug)

  const handleDelete = () => {
    deleteAssignment.mutate(assignment.id, {
      onSuccess: () => setShowDeleteDialog(false),
    })
  }

  const getStatusBadge = () => {
    if (!assignment.available) {
      return <Badge variant='secondary'>Próximamente</Badge>
    }
    if (assignment.past_due) {
      return <Badge variant='destructive'>Vencida</Badge>
    }
    if (assignment.accepting_submissions) {
      return <Badge variant='default'>Activa</Badge>
    }
    return <Badge variant='outline'>Cerrada</Badge>
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No establecida'
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: es })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <div className='mb-2 flex items-center gap-2'>
                <CardTitle className='text-lg'>{assignment.title}</CardTitle>
                {getStatusBadge()}
              </div>
              {assignment.description && (
                <CardDescription>{assignment.description}</CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => onEdit(assignment)}>
                  <Edit className='mr-2 h-4 w-4' />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewStats(assignment)}>
                  <BarChart3 className='mr-2 h-4 w-4' />
                  Ver Estadísticas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewSubmissions(assignment)}>
                  <Users className='mr-2 h-4 w-4' />
                  Ver Entregas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className='text-red-600'
                  disabled={assignment.submission_count > 0}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {/* Info básica */}
            <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
              <div>
                <p className='text-muted-foreground'>Puntos</p>
                <p className='font-semibold'>{assignment.max_points}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Puntaje Mínimo</p>
                <p className='font-semibold'>{assignment.passing_score}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Intentos</p>
                <p className='font-semibold'>{assignment.max_attempts}</p>
              </div>
              <div>
                <p className='text-muted-foreground'>Entregas</p>
                <p className='font-semibold'>{assignment.submission_count}</p>
              </div>
            </div>

            {/* Sección y Lección */}
            <div className='flex gap-4 text-sm'>
              {assignment.section && (
                <div className='flex items-center gap-1'>
                  <FileText className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground'>Sección:</span>
                  <span className='font-medium'>
                    {assignment.section.title}
                  </span>
                </div>
              )}
              {assignment.lesson && (
                <div className='flex items-center gap-1'>
                  <FileText className='text-muted-foreground h-4 w-4' />
                  <span className='text-muted-foreground'>Lección:</span>
                  <span className='font-medium'>{assignment.lesson.title}</span>
                </div>
              )}
            </div>

            {/* Fechas */}
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <Calendar className='h-4 w-4' />
              {assignment.due_at ? (
                <span>Vence {formatDate(assignment.due_at)}</span>
              ) : (
                <span>Sin fecha límite</span>
              )}
            </div>

            {/* Estadísticas */}
            {assignment.submission_count > 0 && (
              <div className='grid grid-cols-3 gap-4 border-t pt-4 text-sm'>
                <div>
                  <p className='text-muted-foreground'>Calificadas</p>
                  <p className='font-semibold'>
                    {assignment.graded_count} / {assignment.submission_count}
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Promedio</p>
                  <p className='font-semibold'>
                    {assignment.average_score.toFixed(1)}
                  </p>
                </div>
                <div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onViewSubmissions(assignment)}
                  >
                    Ver Entregas
                  </Button>
                </div>
              </div>
            )}

            {/* Badges de características */}
            <div className='flex flex-wrap gap-2'>
              {assignment.require_file_upload && (
                <Badge variant='outline' className='text-xs'>
                  Requiere Archivos
                </Badge>
              )}
              {assignment.require_text_submission && (
                <Badge variant='outline' className='text-xs'>
                  Requiere Texto
                </Badge>
              )}
              {assignment.peer_review_enabled && (
                <Badge variant='outline' className='text-xs'>
                  Revisión por Pares
                </Badge>
              )}
              {assignment.allow_resubmission && (
                <Badge variant='outline' className='text-xs'>
                  Permite Re-envío
                </Badge>
              )}
              {assignment.rubric_criteria &&
                assignment.rubric_criteria.length > 0 && (
                  <Badge variant='outline' className='text-xs'>
                    Con Rúbrica
                  </Badge>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Tarea?</AlertDialogTitle>
            <AlertDialogDescription>
              {assignment.submission_count > 0 ? (
                <>
                  No se puede eliminar esta tarea porque ya tiene{' '}
                  <strong>{assignment.submission_count}</strong> entrega(s).
                </>
              ) : (
                <>
                  Esta acción no se puede deshacer. La tarea "{assignment.title}
                  " será eliminada permanentemente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {assignment.submission_count === 0 && (
              <AlertDialogAction
                onClick={handleDelete}
                className='bg-red-600 hover:bg-red-700'
              >
                Eliminar
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
