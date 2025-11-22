import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Assessment } from '@/services/assessment-service'
import {
  MoreVertical,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Clock,
  Award,
  HelpCircle,
} from 'lucide-react'
import { useDeleteAssessment } from '@/hooks/use-assessments'
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

interface AssessmentCardProps {
  assessment: Assessment
  academySlug: string
  courseSlug: string
  onEdit: (assessment: Assessment) => void
  onViewStats: (assessment: Assessment) => void
  onViewAttempts: (assessment: Assessment) => void
}

export function AssessmentCard({
  assessment,
  academySlug,
  courseSlug,
  onEdit,
  onViewStats,
  onViewAttempts,
}: AssessmentCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const navigate = useNavigate()
  const deleteAssessment = useDeleteAssessment(academySlug, courseSlug)

  const handleDelete = () => {
    deleteAssessment.mutate(assessment.id, {
      onSuccess: () => setShowDeleteDialog(false),
    })
  }

  const isQuiz = assessment.type === 'Quiz'

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div className='flex-1'>
              <div className='mb-2 flex items-center gap-2'>
                <CardTitle className='text-lg'>{assessment.title}</CardTitle>
                <Badge variant={isQuiz ? 'default' : 'destructive'}>
                  {isQuiz ? '📝 Quiz' : '🎓 Examen'}
                </Badge>
                {assessment.published ? (
                  <Badge variant='outline' className='bg-green-50'>
                    Publicado
                  </Badge>
                ) : (
                  <Badge variant='secondary'>Borrador</Badge>
                )}
              </div>
              {assessment.description && (
                <CardDescription>{assessment.description}</CardDescription>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  onClick={() =>
                    navigate({
                      to: '/academy/$academySlug/courses/$courseSlug/assessments/$assessmentId/questions',
                      params: {
                        academySlug,
                        courseSlug,
                        assessmentId: String(assessment.id),
                      },
                    })
                  }
                >
                  <HelpCircle className='mr-2 h-4 w-4' />
                  Gestionar Preguntas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(assessment)}>
                  <Edit className='mr-2 h-4 w-4' />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewStats(assessment)}>
                  <BarChart3 className='mr-2 h-4 w-4' />
                  Ver Estadísticas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewAttempts(assessment)}>
                  <Users className='mr-2 h-4 w-4' />
                  Ver Intentos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className='text-red-600'
                  disabled={assessment.attempts_count > 0}
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
            {/* Información */}
            <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
              <div className='flex items-center gap-2'>
                <Award className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground'>Puntaje Mínimo</p>
                  <p className='font-semibold'>{assessment.passing_score}%</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground'>Intentos</p>
                  <p className='font-semibold'>
                    {assessment.attempts_allowed ?? 'Ilimitados'}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='text-muted-foreground h-4 w-4' />
                <div>
                  <p className='text-muted-foreground'>Tiempo Límite</p>
                  <p className='font-semibold'>
                    {assessment.time_limit_minutes
                      ? `${assessment.time_limit_minutes} min`
                      : 'Sin límite'}
                  </p>
                </div>
              </div>
              <div>
                <p className='text-muted-foreground'>Peso</p>
                <p className='font-semibold'>{assessment.weight_percentage}%</p>
              </div>
            </div>

            {/* Sección */}
            {assessment.section && (
              <div className='text-sm'>
                <span className='text-muted-foreground'>Sección: </span>
                <span className='font-medium'>{assessment.section.title}</span>
              </div>
            )}

            {/* Preguntas e Intentos */}
            <div className='flex gap-4 border-t pt-4 text-sm'>
              <div>
                <span className='text-muted-foreground'>Preguntas: </span>
                <span className='font-semibold'>
                  {assessment.questions_count}
                </span>
                <span className='text-muted-foreground'>
                  {' '}
                  ({assessment.total_points} pts)
                </span>
              </div>
              <div>
                <span className='text-muted-foreground'>Intentos: </span>
                <span className='font-semibold'>
                  {assessment.attempts_count}
                </span>
              </div>
            </div>

            {/* Características */}
            <div className='flex flex-wrap gap-2'>
              {assessment.randomize_questions && (
                <Badge variant='outline' className='text-xs'>
                  Preguntas Aleatorias
                </Badge>
              )}
              {assessment.show_correct_answers && (
                <Badge variant='outline' className='text-xs'>
                  Muestra Respuestas
                </Badge>
              )}
              {assessment.require_all_sections_complete && (
                <Badge variant='outline' className='text-xs'>
                  Requiere Completar Todo
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
            <AlertDialogTitle>¿Eliminar Evaluación?</AlertDialogTitle>
            <AlertDialogDescription>
              {assessment.attempts_count > 0 ? (
                <>
                  No se puede eliminar esta evaluación porque ya tiene{' '}
                  <strong>{assessment.attempts_count}</strong> intento(s).
                </>
              ) : (
                <>
                  Esta acción no se puede deshacer. La evaluación "
                  {assessment.title}" será eliminada permanentemente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            {assessment.attempts_count === 0 && (
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
