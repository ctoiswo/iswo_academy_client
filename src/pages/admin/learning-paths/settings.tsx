import { useParams, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  useLearningPath,
  useDeleteLearningPath,
  useUpdateLearningPathSettings,
} from '@/hooks/use-learning-paths'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, AlertTriangle } from 'lucide-react'

export function LearningPathSettings() {
  const navigate = useNavigate()
  const { academySlug, learningPathSlug } = useParams({
    from: '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/settings',
  })
  const { data: learningPath, isLoading } = useLearningPath(academySlug, learningPathSlug)
  const deleteMutation = useDeleteLearningPath(academySlug)
  const updateMutation = useUpdateLearningPathSettings(academySlug, learningPathSlug)

  const [status, setStatus] = useState<string>('')
  const [position, setPosition] = useState<number>(0)
  const [hasChanges, setHasChanges] = useState(false)

  // Initialize state when learning path loads
  useEffect(() => {
    if (learningPath) {
      setStatus(learningPath.status)
      setPosition(learningPath.position)
    }
  }, [learningPath])

  // Track changes only for position (status updates immediately)
  useEffect(() => {
    if (learningPath) {
      const positionChanged = position !== learningPath.position
      setHasChanges(positionChanged)
    }
  }, [position, learningPath])

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(learningPathSlug)
      navigate({
        to: '/academy/$academySlug/learning-paths',
        params: { academySlug },
      })
    } catch (_error) {
      // console.error('Error deleting learning path:', error)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    if (learningPath && newStatus !== learningPath.status) {
      await updateMutation.mutateAsync({ status: newStatus })
    }
  }

  const handlePositionChange = (newPosition: number) => {
    setPosition(newPosition)
  }

  const handleSavePosition = async () => {
    if (learningPath && position !== learningPath.position) {
      await updateMutation.mutateAsync({ position })
      setHasChanges(false)
    }
  }

  const handleCancel = () => {
    if (learningPath) {
      setPosition(learningPath.position)
      setHasChanges(false)
    }
  }

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
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Ajustes generales de la ruta de aprendizaje
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estado de Publicación</CardTitle>
          <CardDescription>
            Controla la visibilidad de esta ruta para los estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger id="status" disabled={updateMutation.isPending}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Borrador</Badge>
                    <span className="text-sm">- No visible para estudiantes</span>
                  </div>
                </SelectItem>
                <SelectItem value="published">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Publicado</Badge>
                    <span className="text-sm">- Visible para todos</span>
                  </div>
                </SelectItem>
                <SelectItem value="archived">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Archivado</Badge>
                    <span className="text-sm">- Oculto pero accesible por URL</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Estado actual: <span className="font-medium capitalize">{status}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orden de Visualización</CardTitle>
          <CardDescription>
            Define el orden en que aparecerá esta ruta en el listado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="position">Posición</Label>
            <Input
              id="position"
              type="number"
              min="0"
              value={position}
              onChange={(e) => handlePositionChange(parseInt(e.target.value) || 0)}
              className="w-32"
            />
            <p className="text-sm text-muted-foreground">
              Menor número = aparece primero en la lista
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información del Sistema</CardTitle>
          <CardDescription>Datos técnicos de la ruta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">ID</Label>
              <p className="font-mono">{learningPath.id}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Slug</Label>
              <p className="font-mono">{learningPath.slug}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Creado</Label>
              <p>{new Date(learningPath.created_at).toLocaleDateString('es-ES')}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Última Actualización</Label>
              <p>{new Date(learningPath.updated_at).toLocaleDateString('es-ES')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6 border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Ruta de Aprendizaje
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                ¿Estás seguro?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente la ruta de
                aprendizaje "{learningPath.title}".
                {learningPath.courses_count > 0 && (
                  <p className="mt-2 text-destructive font-medium">
                    Advertencia: Esta ruta contiene {learningPath.courses_count} curso(s). Los
                    cursos no serán eliminados, pero se desasociarán de esta ruta.
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                Sí, Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={!hasChanges}>
            Cancelar
          </Button>
          <Button
            onClick={handleSavePosition}
            disabled={!hasChanges || updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Guardando...' : 'Guardar Posición'}
          </Button>
        </div>
      </div>
    </div>
  )
}
