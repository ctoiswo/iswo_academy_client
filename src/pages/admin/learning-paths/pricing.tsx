import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { useLearningPath, useUpdateLearningPath } from '@/hooks/use-learning-paths'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { DollarSign, Percent, TrendingDown } from 'lucide-react'

export function LearningPathPricing() {
  const { academySlug, learningPathSlug } = useParams({
    from: '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/pricing',
  })
  const { data: learningPath, isLoading } = useLearningPath(academySlug, learningPathSlug)
  const updateMutation = useUpdateLearningPath(academySlug)
  
  const [isFree, setIsFree] = useState(false)
  const [useCustomPrice, setUseCustomPrice] = useState(false)
  const [customPrice, setCustomPrice] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState(0)

  // Initialize state when learningPath loads
  useEffect(() => {
    if (learningPath?.pricing) {
      setIsFree(learningPath.pricing.is_free)
      setDiscountPercentage(learningPath.pricing.discount_percentage || 0)
      if (learningPath.pricing.price) {
        setUseCustomPrice(true)
        setCustomPrice(learningPath.pricing.price)
      }
    }
  }, [learningPath])

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      learningPathSlug,
      data: {
        is_free: isFree,
        price: useCustomPrice ? customPrice : undefined,
        discount_percentage: isFree ? 0 : discountPercentage,
      },
    })
  }

  const handleCancel = () => {
    if (learningPath?.pricing) {
      setIsFree(learningPath.pricing.is_free)
      setDiscountPercentage(learningPath.pricing.discount_percentage || 0)
      if (learningPath.pricing.price) {
        setUseCustomPrice(true)
        setCustomPrice(learningPath.pricing.price)
      } else {
        setUseCustomPrice(false)
        setCustomPrice('')
      }
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

  const courses = learningPath.courses || []
  const totalIndividualPrice = courses.reduce((acc, course) => acc + parseFloat(course.price), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración de Precios</h1>
        <p className="text-muted-foreground">
          Define el precio y descuentos para esta ruta de aprendizaje
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tipo de Ruta</CardTitle>
          <CardDescription>Define si esta ruta es gratuita o de pago</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="is_free">Ruta Gratuita</Label>
              <p className="text-sm text-muted-foreground">
                Los estudiantes pueden inscribirse sin costo
              </p>
            </div>
            <Switch id="is_free" checked={isFree} onCheckedChange={setIsFree} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Precio Individual de Cursos
            </CardTitle>
            <CardDescription>Suma de todos los cursos por separado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="flex justify-between items-center">
                  <span className="text-sm">{course.title}</span>
                  <span className="font-medium">${course.price}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between items-center font-bold">
                <span>Total Individual</span>
                <span className="text-lg">${totalIndividualPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Descuento del Bundle
            </CardTitle>
            <CardDescription>
              Define el descuento para comprar todos los cursos juntos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Porcentaje de Descuento</Label>
              <div className="flex gap-2">
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(parseInt(e.target.value) || 0)}
                  disabled={isFree}
                  placeholder="0"
                />
                <span className="flex items-center text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Precio Original</span>
                <span className="line-through">${totalIndividualPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Descuento ({discountPercentage}%)</span>
                <span className="text-green-600">-${(totalIndividualPrice * discountPercentage / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg pt-2 border-t">
                <span>Precio Final del Bundle</span>
                <span className="text-primary">${(totalIndividualPrice * (1 - discountPercentage / 100)).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Precio Personalizado
          </CardTitle>
          <CardDescription>
            Opcionalmente, define un precio fijo en lugar de calcular por cursos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="custom_price">Usar Precio Personalizado</Label>
              <p className="text-sm text-muted-foreground">
                Ignora la suma de cursos y usa un precio fijo
              </p>
            </div>
            <Switch id="custom_price" checked={useCustomPrice} onCheckedChange={setUseCustomPrice} disabled={isFree} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Precio Personalizado</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder="0.00"
              disabled={!useCustomPrice || isFree}
            />
          </div>
        </CardContent>
      </Card>

      <Alert>
        <AlertDescription>
          {isFree ? (
            'Esta ruta es gratuita. Los estudiantes podrán inscribirse sin costo.'
          ) : (
            <>El precio final que verán los estudiantes será $
              {useCustomPrice 
                ? parseFloat(customPrice || '0').toFixed(2)
                : (totalIndividualPrice * (1 - discountPercentage / 100)).toFixed(2)
              }. {discountPercentage > 0 && !useCustomPrice && `Ahorro de $${(totalIndividualPrice * discountPercentage / 100).toFixed(2)} (${discountPercentage}% de descuento).`}
            </>
          )}
        </AlertDescription>
      </Alert>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </div>
  )
}
