import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Assessment } from '@/types'
import {
  MoreVertical,
  Edit,
  Trash2,
  BarChart3,
  Users,
  Clock,
  Award,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Shuffle,
  Eye,
  CheckSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { Button } from '@/components/ui/button'
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
      <div className='border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-5 transition-all duration-200 hover:shadow-[0_0_16px_rgba(99,102,241,0.06)]'>
        {/* Header row */}
        <div className='flex items-start justify-between gap-3'>
          <div className='flex min-w-0 items-center gap-3'>
            <div
              className={cn(
                'shrink-0 rounded-lg p-2',
                isQuiz ? 'bg-emerald-500/10' : 'bg-amber-500/10'
              )}
            >
              {isQuiz ? (
                <BookOpen className='size-4 text-emerald-400' />
              ) : (
                <GraduationCap className='size-4 text-amber-400' />
              )}
            </div>
            <div className='min-w-0'>
              <div className='flex flex-wrap items-center gap-2'>
                <h3 className='text-foreground truncate text-sm font-semibold'>
                  {assessment.title}
                </h3>
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 text-xs font-medium',
                    isQuiz
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-amber-500/10 text-amber-400'
                  )}
                >
                  {isQuiz ? 'Quiz' : 'Examen'}
                </span>
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 text-xs font-medium',
                    assessment.published
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground bg-muted'
                  )}
                >
                  {assessment.published ? 'Publicado' : 'Borrador'}
                </span>
              </div>
              {assessment.description && (
                <p className='text-muted-foreground mt-0.5 line-clamp-1 text-xs'>
                  {assessment.description}
                </p>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='shrink-0'>
                <MoreVertical className='size-4' />
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
                <HelpCircle className='mr-2 size-4' />
                Gestionar preguntas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(assessment)}>
                <Edit className='mr-2 size-4' />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewStats(assessment)}>
                <BarChart3 className='mr-2 size-4' />
                Ver estadísticas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewAttempts(assessment)}>
                <Users className='mr-2 size-4' />
                Ver intentos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className='text-destructive focus:text-destructive'
                disabled={assessment.attempts_count > 0}
              >
                <Trash2 className='mr-2 size-4' />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats row */}
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          <div className='bg-muted/40 flex items-center gap-2 rounded-lg px-3 py-2'>
            <Award className='text-muted-foreground size-3.5 shrink-0' />
            <div className='min-w-0'>
              <p className='text-muted-foreground text-[10px]'>Mínimo</p>
              <p className='text-foreground text-xs font-semibold'>{assessment.passing_score}%</p>
            </div>
          </div>
          <div className='bg-muted/40 flex items-center gap-2 rounded-lg px-3 py-2'>
            <Users className='text-muted-foreground size-3.5 shrink-0' />
            <div className='min-w-0'>
              <p className='text-muted-foreground text-[10px]'>Intentos</p>
              <p className='text-foreground text-xs font-semibold'>
                {assessment.attempts_allowed ?? '∞'}
              </p>
            </div>
          </div>
          <div className='bg-muted/40 flex items-center gap-2 rounded-lg px-3 py-2'>
            <Clock className='text-muted-foreground size-3.5 shrink-0' />
            <div className='min-w-0'>
              <p className='text-muted-foreground text-[10px]'>Tiempo</p>
              <p className='text-foreground text-xs font-semibold'>
                {assessment.time_limit_minutes
                  ? `${assessment.time_limit_minutes} min`
                  : '—'}
              </p>
            </div>
          </div>
          <div className='bg-muted/40 flex items-center gap-2 rounded-lg px-3 py-2'>
            <HelpCircle className='text-muted-foreground size-3.5 shrink-0' />
            <div className='min-w-0'>
              <p className='text-muted-foreground text-[10px]'>Preguntas</p>
              <p className='text-foreground text-xs font-semibold'>
                {assessment.questions_count}{' '}
                <span className='text-muted-foreground font-normal'>
                  ({assessment.total_points} pts)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer row */}
        <div className='border-border/50 flex flex-wrap items-center justify-between gap-2 border-t pt-3'>
          <div className='flex flex-wrap gap-1.5'>
            {assessment.section && (
              <span className='text-muted-foreground bg-muted rounded-md px-2 py-0.5 text-xs'>
                {assessment.section.title}
              </span>
            )}
            {assessment.randomize_questions && (
              <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                <Shuffle className='size-3' />
                Aleatorio
              </span>
            )}
            {assessment.show_correct_answers && (
              <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                <Eye className='size-3' />
                Muestra respuestas
              </span>
            )}
            {assessment.require_all_sections_complete && (
              <span className='text-muted-foreground flex items-center gap-1 text-xs'>
                <CheckSquare className='size-3' />
                Requiere completar todo
              </span>
            )}
          </div>
          <span className='text-muted-foreground text-xs'>
            {assessment.attempts_count} intento{assessment.attempts_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evaluación?</AlertDialogTitle>
            <AlertDialogDescription>
              {assessment.attempts_count > 0 ? (
                <>
                  No se puede eliminar porque ya tiene{' '}
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
                className='bg-destructive hover:bg-destructive/90'
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
