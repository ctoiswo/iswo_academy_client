import { useParams } from '@tanstack/react-router'
import { useLearningPath } from '@/hooks/use-learning-paths'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LearningPathCourses as LearningPathCoursesComponent } from '@/components/learning-paths/learning-path-courses'

export function LearningPathCourses() {
  const { academySlug, learningPathSlug } = useParams({
    from: '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/courses',
  })
  const { data: learningPath, isLoading } = useLearningPath(academySlug, learningPathSlug)

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cursos</h1>
        <p className="text-muted-foreground">
          Gestiona los cursos de esta ruta de aprendizaje
        </p>
      </div>

      <LearningPathCoursesComponent learningPath={learningPath} />

      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Total de Cursos</label>
            <p className="text-2xl font-bold">{learningPath.courses?.length || 0}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Duración Total</label>
            <p className="text-2xl font-bold">
              {Math.floor(learningPath.total_duration_minutes / 60)}h
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Lecciones Totales</label>
            <p className="text-2xl font-bold">
              {learningPath.courses?.reduce((acc, course) => acc + course.lessons_count, 0) || 0}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
