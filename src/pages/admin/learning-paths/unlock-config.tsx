import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useLearningPath, useUpdateLearningPath } from '@/hooks/use-learning-paths'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, Lock, Unlock, Target } from 'lucide-react'

export function LearningPathUnlockConfig() {
  const { academySlug, learningPathSlug } = useParams({
    from: '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/unlock-config',
  })
  const { data: learningPath, isLoading } = useLearningPath(academySlug, learningPathSlug)
  const updateMutation = useUpdateLearningPath(academySlug)
  
  const [unlockMode, setUnlockMode] = useState<'all_unlocked' | 'sequential' | 'milestone_based'>('all_unlocked')
  const [milestoneSize, setMilestoneSize] = useState(3)

  // Initialize state when learningPath loads
  useEffect(() => {
    if (learningPath) {
      setUnlockMode(learningPath.unlock_mode)
      setMilestoneSize(learningPath.milestone_size || 3)
    }
  }, [learningPath])

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      learningPathSlug,
      data: {
        unlock_mode: unlockMode,
        milestone_size: unlockMode === 'milestone_based' ? milestoneSize : undefined,
      },
    })
  }

  const handleCancel = () => {
    if (learningPath) {
      setUnlockMode(learningPath.unlock_mode)
      setMilestoneSize(learningPath.milestone_size || 3)
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
        <h1 className="text-3xl font-bold">Configuración de Desbloqueo</h1>
        <p className="text-muted-foreground">
          Define cómo los estudiantes accederán a los cursos de esta ruta
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Esta configuración determina el orden y la forma en que los estudiantes pueden
          acceder a los cursos dentro de esta ruta de aprendizaje.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Modo de Desbloqueo</CardTitle>
          <CardDescription>
            Selecciona cómo quieres que los estudiantes accedan a los cursos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={unlockMode} onValueChange={(value) => setUnlockMode(value as typeof unlockMode)} className="space-y-4">
            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="all_unlocked" id="all_unlocked" />
              <div className="flex-1 space-y-1">
                <Label htmlFor="all_unlocked" className="flex items-center gap-2 cursor-pointer">
                  <Unlock className="h-4 w-4" />
                  <span className="font-semibold">Todos Desbloqueados</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Los estudiantes pueden acceder a todos los cursos en cualquier orden desde
                  el inicio.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="sequential" id="sequential" />
              <div className="flex-1 space-y-1">
                <Label htmlFor="sequential" className="flex items-center gap-2 cursor-pointer">
                  <Lock className="h-4 w-4" />
                  <span className="font-semibold">Secuencial</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Los cursos se desbloquean uno por uno. El estudiante debe completar un
                  curso para acceder al siguiente.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/50 transition-colors">
              <RadioGroupItem value="milestone_based" id="milestone_based" />
              <div className="flex-1 space-y-1">
                <Label
                  htmlFor="milestone_based"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Target className="h-4 w-4" />
                  <span className="font-semibold">Por Hitos</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Los cursos se desbloquean en grupos. Completa cierto número de cursos
                  para desbloquear el siguiente grupo.
                </p>
                <div className="mt-3 space-y-2">
                  <Label htmlFor="milestone_size" className="text-sm">
                    Tamaño del grupo de hitos
                  </Label>
                  <Input
                    id="milestone_size"
                    type="number"
                    min="1"
                    max="10"
                    value={milestoneSize}
                    onChange={(e) => setMilestoneSize(parseInt(e.target.value) || 3)}
                    disabled={unlockMode !== 'milestone_based'}
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    Número de cursos que se desbloquean en cada grupo
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vista Previa</CardTitle>
          <CardDescription>
            Así verán los estudiantes el progreso de desbloqueo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(learningPath.courses || []).map((course, index) => {
              const isUnlocked = 
                unlockMode === 'all_unlocked' ||
                (unlockMode === 'sequential' && index === 0) ||
                (unlockMode === 'milestone_based' && index < milestoneSize)
              
              const getUnlockMessage = () => {
                if (unlockMode === 'all_unlocked') {
                  return 'Disponible desde el inicio'
                } else if (unlockMode === 'sequential') {
                  if (index === 0) return 'Disponible ahora'
                  return `Se desbloquea al completar: ${(learningPath.courses || [])[index - 1]?.title}`
                } else {
                  // milestone_based
                  const milestone = Math.floor(index / milestoneSize)
                  if (milestone === 0) return `Disponible en el primer grupo (1-${milestoneSize})`
                  const previousMilestoneEnd = milestone * milestoneSize
                  return `Se desbloquea al completar ${previousMilestoneEnd} cursos`
                }
              }

              return (
                <div
                  key={course.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {isUnlocked ? (
                      <Unlock className="h-5 w-5 text-green-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {getUnlockMessage()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
