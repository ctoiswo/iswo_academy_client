import { useParams } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { useLearningPaths } from '@/hooks/use-learning-paths'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Plus, Route as RouteIcon, Clock, BookOpen, TrendingUp } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { LearningPathFormDialog } from '@/components/learning-paths'

export function AcademyLearningPathsPage() {
  const { academySlug } = useParams({ from: '/_authenticated/academy/$academySlug/learning-paths/' })
  const { currentAcademy } = useAuthStore()
  const { data, isLoading } = useLearningPaths(currentAcademy?.slug || '')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const learningPaths = data?.data || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rutas de Aprendizaje</h1>
          <p className="text-muted-foreground">
            Gestiona las rutas de aprendizaje de tu academia
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Ruta
        </Button>
      </div>

      {learningPaths.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <RouteIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay rutas de aprendizaje</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crea tu primera ruta para organizar cursos
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primera Ruta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {learningPaths.map((path) => (
            <Link
              key={path.id}
              to="/academy/$academySlug/learning-paths/$learningPathSlug/info"
              params={{ academySlug, learningPathSlug: path.slug }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={
                        path.status === 'published'
                          ? 'default'
                          : path.status === 'draft'
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {path.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {path.difficulty_level}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{path.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {path.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{path.courses_count} cursos</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{path.estimated_duration_hours} horas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>Score: {path.estimated_completion_score}</span>
                    </div>
                    {path.progress && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">
                            {path.progress.completion_percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${path.progress.completion_percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <LearningPathFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        mode="create"
      />
    </div>
  )
}
