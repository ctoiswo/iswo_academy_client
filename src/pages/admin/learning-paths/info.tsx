import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Pencil } from 'lucide-react'
import { useLearningPath } from '@/hooks/use-learning-paths'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LearningPathFormDialog } from '@/components/learning-paths'

export function LearningPathInfo() {
  const { academySlug, learningPathSlug } = useParams({
    from: '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/info',
  })
  const { data: learningPath, isLoading } = useLearningPath(
    academySlug,
    learningPathSlug
  )
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (!learningPath) {
    return <div>Ruta de aprendizaje no encontrada</div>
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{learningPath.title}</h1>
          <p className='text-muted-foreground'>
            Información general de la ruta de aprendizaje
          </p>
        </div>
        <Button onClick={() => setIsEditDialogOpen(true)}>
          <Pencil className='mr-2 h-4 w-4' />
          Editar
        </Button>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Detalles Básicos</CardTitle>
            <CardDescription>Información general de la ruta</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Título</label>
              <p className='text-muted-foreground text-sm'>
                {learningPath.title}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium'>Slug</label>
              <p className='text-muted-foreground font-mono text-sm'>
                {learningPath.slug}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium'>Estado</label>
              <div className='mt-1'>
                <Badge
                  variant={
                    learningPath.status === 'published'
                      ? 'default'
                      : learningPath.status === 'draft'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {learningPath.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className='text-sm font-medium'>Nivel de Dificultad</label>
              <p className='text-muted-foreground text-sm capitalize'>
                {learningPath.difficulty_level}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <CardDescription>Métricas de la ruta</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium'>Total de Cursos</label>
              <p className='text-2xl font-bold'>{learningPath.courses_count}</p>
            </div>
            <div>
              <label className='text-sm font-medium'>Duración Estimada</label>
              <p className='text-2xl font-bold'>
                {learningPath.estimated_duration_hours}h
              </p>
            </div>
            <div>
              <label className='text-sm font-medium'>Duración Total</label>
              <p className='text-muted-foreground text-sm'>
                {Math.floor(learningPath.total_duration_minutes / 60)}h{' '}
                {learningPath.total_duration_minutes % 60}m
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground text-sm whitespace-pre-wrap'>
              {learningPath.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Creador</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm font-medium'>{learningPath.creator.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academia</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm font-medium'>{learningPath.academy.name}</p>
            <p className='text-muted-foreground text-xs'>
              {learningPath.academy.slug}
            </p>
          </CardContent>
        </Card>
      </div>

      <LearningPathFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        learningPath={learningPath}
        mode='edit'
      />
    </div>
  )
}
