import type { Assessment } from '@/services/assessment-service'
import { BarChart3, Users, Award, TrendingUp } from 'lucide-react'
import { useAssessmentStatistics } from '@/hooks/use-assessments'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

interface AssessmentStatisticsDialogProps {
  assessment: Assessment | null
  onOpenChange: (open: boolean) => void
  academySlug: string
  courseSlug: string
}

export function AssessmentStatisticsDialog({
  assessment,
  onOpenChange,
  academySlug,
  courseSlug,
}: AssessmentStatisticsDialogProps) {
  const { data: statistics, isLoading } = useAssessmentStatistics(
    academySlug,
    courseSlug,
    assessment?.id || 0
  )

  if (!assessment) return null

  const isQuiz = assessment.type === 'Quiz'

  return (
    <Dialog open={!!assessment} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <span className='text-2xl'>{isQuiz ? '📝' : '🎓'}</span>
            Estadísticas: {assessment.title}
          </DialogTitle>
          <DialogDescription>
            Resumen de rendimiento y métricas de esta evaluación
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className='h-32' />
              ))}
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Main Stats Grid */}
            <div className='grid grid-cols-2 gap-4'>
              <Card>
                <CardContent className='pt-6'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>
                        Tasa de Completado
                      </p>
                      <p className='mt-2 text-3xl font-bold'>
                        {statistics?.completion_rate
                          ? `${statistics.completion_rate.toFixed(1)}%`
                          : 'N/A'}
                      </p>
                      <p className='mt-1 text-xs text-gray-500'>
                        De todos los estudiantes
                      </p>
                    </div>
                    <div className='rounded-full bg-blue-100 p-3'>
                      <Users className='h-6 w-6 text-blue-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>
                        Tasa de Aprobación
                      </p>
                      <p className='mt-2 text-3xl font-bold'>
                        {statistics?.pass_rate
                          ? `${statistics.pass_rate.toFixed(1)}%`
                          : 'N/A'}
                      </p>
                      <p className='mt-1 text-xs text-gray-500'>
                        De los que completaron
                      </p>
                    </div>
                    <div className='rounded-full bg-green-100 p-3'>
                      <Award className='h-6 w-6 text-green-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>
                        Promedio de Puntuación
                      </p>
                      <p className='mt-2 text-3xl font-bold'>
                        {statistics?.average_score
                          ? `${statistics.average_score.toFixed(1)}%`
                          : 'N/A'}
                      </p>
                      <p className='mt-1 text-xs text-gray-500'>
                        De {assessment.total_points} puntos posibles
                      </p>
                    </div>
                    <div className='rounded-full bg-purple-100 p-3'>
                      <BarChart3 className='h-6 w-6 text-purple-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='pt-6'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-sm font-medium text-gray-600'>
                        Total de Intentos
                      </p>
                      <p className='mt-2 text-3xl font-bold'>
                        {statistics?.total_attempts || 0}
                      </p>
                      <p className='mt-1 text-xs text-gray-500'>
                        Máximo: {assessment.attempts_allowed}{' '}
                        {assessment.attempts_allowed === 1
                          ? 'intento'
                          : 'intentos'}
                      </p>
                    </div>
                    <div className='rounded-full bg-orange-100 p-3'>
                      <TrendingUp className='h-6 w-6 text-orange-600' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <Card className='bg-gray-50'>
              <CardContent className='pt-6'>
                <h4 className='mb-4 font-semibold'>
                  Configuración de la Evaluación
                </h4>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div>
                    <p className='text-gray-600'>Puntaje Mínimo</p>
                    <p className='font-medium'>{assessment.passing_score}%</p>
                  </div>
                  <div>
                    <p className='text-gray-600'>Intentos Permitidos</p>
                    <p className='font-medium'>
                      {assessment.attempts_allowed}{' '}
                      {assessment.attempts_allowed === 1
                        ? 'intento'
                        : 'intentos'}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-600'>Tiempo Límite</p>
                    <p className='font-medium'>
                      {assessment.time_limit_minutes
                        ? `${assessment.time_limit_minutes} minutos`
                        : 'Sin límite'}
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-600'>Peso en Calificación</p>
                    <p className='font-medium'>
                      {assessment.weight_percentage}%
                    </p>
                  </div>
                  <div>
                    <p className='text-gray-600'>Total de Preguntas</p>
                    <p className='font-medium'>{assessment.questions_count}</p>
                  </div>
                  <div>
                    <p className='text-gray-600'>Puntos Totales</p>
                    <p className='font-medium'>{assessment.total_points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {!statistics && (
              <div className='py-8 text-center text-gray-500'>
                <BarChart3 className='mx-auto mb-2 h-12 w-12 opacity-30' />
                <p>No hay datos de estadísticas disponibles aún</p>
                <p className='text-sm'>
                  Las estadísticas se generarán una vez que los estudiantes
                  comiencen a realizar esta evaluación
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
