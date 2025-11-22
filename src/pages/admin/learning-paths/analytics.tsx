import { useParams } from '@tanstack/react-router'
import { useLearningPath, useLearningPathAnalytics } from '@/hooks/use-learning-paths'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react'

export function LearningPathAnalytics() {
  const { academySlug, learningPathSlug } = useParams({
    from: '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/analytics',
  })
  const { data: learningPath, isLoading: isLoadingPath } = useLearningPath(academySlug, learningPathSlug)
  const { data: analytics, isLoading: isLoadingAnalytics } = useLearningPathAnalytics(academySlug, learningPathSlug)

  const isLoading = isLoadingPath || isLoadingAnalytics

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!learningPath) {
    return <div>Ruta de aprendizaje no encontrada</div>
  }

  if (!analytics) {
    return <div>No se pudieron cargar las estadísticas</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estadísticas</h1>
        <p className="text-muted-foreground">
          Métricas y análisis de esta ruta de aprendizaje
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inscritos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.total_enrollments}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.active_students} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Completado</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completion_rate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.completed_students} completados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avg_completion_time_days}</div>
            <p className="text-xs text-muted-foreground">días para completar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Abandono</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.dropout_rate}%</div>
            <p className="text-xs text-muted-foreground">abandonaron la ruta</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progreso por Curso</CardTitle>
            <CardDescription>
              Porcentaje de estudiantes que completaron cada curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.course_progress.length > 0 ? (
                analytics.course_progress.map((courseProgress, index) => (
                  <div key={courseProgress.course_id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {index + 1}. {courseProgress.course_title}
                      </span>
                      <span className="text-muted-foreground">
                        {courseProgress.completion_percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${courseProgress.completion_percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No hay cursos en esta ruta</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inscripciones en el Tiempo</CardTitle>
            <CardDescription>Tendencia de inscripciones mensuales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Gráfico de inscripciones (integrar con librería de charts)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement</CardTitle>
            <CardDescription>Nivel de participación de los estudiantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Muy Activos</span>
                <span className="text-sm font-bold">{analytics.engagement_levels.very_active}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Moderadamente Activos</span>
                <span className="text-sm font-bold">{analytics.engagement_levels.moderately_active}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Poco Activos</span>
                <span className="text-sm font-bold">{analytics.engagement_levels.low_activity}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Curso con Mayor Abandono</CardTitle>
            <CardDescription>
              Curso donde más estudiantes abandonan la ruta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.highest_dropout_course ? (
              <div className="space-y-2">
                <p className="font-medium">{analytics.highest_dropout_course.course_title}</p>
                <p className="text-sm text-muted-foreground">
                  {analytics.highest_dropout_course.dropout_rate.toFixed(0)}% de abandono en este curso
                </p>
                <p className="text-xs text-muted-foreground">
                  Considera revisar el contenido o dificultad
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
