import { useState } from 'react'
import type { Assessment } from '@/types'
import { CheckCircle2, XCircle, Clock, User } from 'lucide-react'
import { useAssessmentAttempts } from '@/hooks/use-assessments'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AssessmentAttemptsDialogProps {
  assessment: Assessment | null
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
}

export function AssessmentAttemptsDialog({
  assessment,
  onOpenChange,
  academySlug,
  courseSlug,
}: AssessmentAttemptsDialogProps) {
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'completed' | 'in_progress'
  >('all')

  const { data: attempts, isLoading } = useAssessmentAttempts(
    academySlug,
    courseSlug,
    assessment?.id || 0,
    statusFilter === 'all' ? undefined : statusFilter
  )

  if (!assessment) return null

  const isQuiz = assessment.type === 'Quiz'
  const completedCount =
    attempts?.filter((a) => a.status === 'completed').length || 0
  const inProgressCount =
    attempts?.filter((a) => a.status === 'in_progress').length || 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getStatusBadge = (status: string, passed: boolean | null) => {
    if (status === 'completed') {
      if (passed === true) {
        return (
          <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>
            <CheckCircle2 className='mr-1 h-3 w-3' />
            Aprobado
          </Badge>
        )
      } else if (passed === false) {
        return (
          <Badge className='bg-red-100 text-red-800 hover:bg-red-100'>
            <XCircle className='mr-1 h-3 w-3' />
            Reprobado
          </Badge>
        )
      }
      return <Badge variant='secondary'>Completado</Badge>
    }
    return (
      <Badge className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100'>
        <Clock className='mr-1 h-3 w-3' />
        En Progreso
      </Badge>
    )
  }

  return (
    <Dialog open={!!assessment} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-5xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <span className='text-2xl'>{isQuiz ? '📝' : '🎓'}</span>
            Intentos: {assessment.title}
          </DialogTitle>
          <DialogDescription>
            Historial de todos los intentos de los estudiantes en esta
            evaluación
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
          >
            <TabsList>
              <TabsTrigger value='all'>
                Todos ({attempts?.length || 0})
              </TabsTrigger>
              <TabsTrigger value='completed'>
                Completados ({completedCount})
              </TabsTrigger>
              <TabsTrigger value='in_progress'>
                En Progreso ({inProgressCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className='space-y-2'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='h-16' />
              ))}
            </div>
          ) : attempts && attempts.length > 0 ? (
            <div className='rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className='flex items-center gap-2'>
                        <User className='h-4 w-4' />
                        Estudiante
                      </div>
                    </TableHead>
                    <TableHead>Intento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Puntuación</TableHead>
                    <TableHead>Duración</TableHead>
                    <TableHead>Fecha Inicio</TableHead>
                    <TableHead>Fecha Fin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell className='font-medium'>
                        {attempt.user?.name || attempt.user?.email || 'Anónimo'}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {attempt.attempt_number} /{' '}
                          {assessment.attempts_allowed}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(attempt.status, attempt.passed)}
                      </TableCell>
                      <TableCell>
                        {attempt.score !== null ? (
                          <div>
                            <span className='font-semibold'>
                              {attempt.score}
                            </span>
                            <span className='text-sm text-muted-foreground'>
                              {' '}
                              / {assessment.total_points}
                            </span>
                            <div className='text-xs text-muted-foreground'>
                              {attempt.percentage !== null
                                ? `${attempt.percentage.toFixed(1)}%`
                                : ''}
                            </div>
                          </div>
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                      <TableCell className='text-sm'>
                        {formatDuration(attempt.time_spent_seconds)}
                      </TableCell>
                      <TableCell className='text-sm'>
                        {formatDate(attempt.started_at)}
                      </TableCell>
                      <TableCell className='text-sm'>
                        {attempt.completed_at ? (
                          formatDate(attempt.completed_at)
                        ) : (
                          <span className='text-muted-foreground'>-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='py-12 text-center text-muted-foreground'>
              <Clock className='mx-auto mb-2 h-12 w-12 opacity-30' />
              <p className='font-medium'>
                {statusFilter === 'all' && 'No hay intentos registrados aún'}
                {statusFilter === 'completed' && 'No hay intentos completados'}
                {statusFilter === 'in_progress' &&
                  'No hay intentos en progreso'}
              </p>
              <p className='mt-1 text-sm'>
                {statusFilter === 'all'
                  ? 'Los intentos aparecerán aquí cuando los estudiantes comiencen a realizar esta evaluación'
                  : 'Cambia el filtro para ver otros intentos'}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
