import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import superAdminGamificationService, { type BadgeDetail, type UpdateBadgeData } from '@/services/super-admin-gamification-service'

interface EditBadgeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  badge: BadgeDetail | null
  academySlug: string
  onSuccess: () => void
}

const CATEGORY_OPTIONS = [
  { value: 'milestone', label: 'Hitos' },
  { value: 'social', label: 'Social' },
  { value: 'mastery', label: 'Maestría' },
  { value: 'special', label: 'Especial' },
  { value: 'streak', label: 'Racha' },
  { value: 'collection', label: 'Colección' },
]

const TIER_OPTIONS = [
  { value: 'bronze', label: 'Bronce' },
  { value: 'silver', label: 'Plata' },
  { value: 'gold', label: 'Oro' },
  { value: 'platinum', label: 'Platino' },
  { value: 'diamond', label: 'Diamante' },
]

const RARITY_OPTIONS = [
  { value: 'common', label: 'Común' },
  { value: 'uncommon', label: 'Poco común' },
  { value: 'rare', label: 'Raro' },
  { value: 'epic', label: 'Épico' },
  { value: 'legendary', label: 'Legendario' },
]

export function EditBadgeDialog({
  open,
  onOpenChange,
  badge,
  academySlug,
  onSuccess,
}: EditBadgeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'milestone',
    tier: 'bronze',
    rarity: 'common',
    points_reward: 50,
    icon_url: '',
    is_secret: false,
    is_active: true,
    display_order: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (badge) {
      setFormData({
        name: badge.name,
        slug: badge.slug,
        description: badge.description,
        category: badge.category,
        tier: badge.tier,
        rarity: badge.rarity,
        points_reward: badge.points_reward,
        icon_url: badge.icon_url || '',
        is_secret: badge.is_secret,
        is_active: badge.is_active,
        display_order: badge.display_order,
      })
      setErrors({})
    }
  }, [badge])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres'
    }

    if (!formData.slug || formData.slug.length < 3) {
      newErrors.slug = 'El slug debe tener al menos 3 caracteres'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones'
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres'
    }

    if (formData.points_reward < 0) {
      newErrors.points_reward = 'Los puntos deben ser mayores o iguales a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!badge || !validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const updateData: UpdateBadgeData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        tier: formData.tier,
        rarity: formData.rarity,
        points_reward: formData.points_reward,
        icon_url: formData.icon_url || undefined,
        is_secret: formData.is_secret,
        is_active: formData.is_active,
        display_order: formData.display_order,
      }

      await superAdminGamificationService.updateBadge(academySlug, badge.id, updateData)

      toast.success('Badge actualizado correctamente')
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      // console.error('Error updating badge:', error)
      toast.error(
        error.response?.data?.message || 'No se pudo actualizar el badge'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!badge) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Badge</DialogTitle>
          <DialogDescription>
            Modifica los datos del badge "{badge.name}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="edit-slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Identificador único (solo letras minúsculas, números y guiones)
            </p>
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">
              Descripción <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Category, Tier, Rarity */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">
                Categoría <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger id="edit-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-tier">
                Nivel <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.tier}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tier: value }))
                }
              >
                <SelectTrigger id="edit-tier">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-rarity">
                Rareza <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.rarity}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, rarity: value }))
                }
              >
                <SelectTrigger id="edit-rarity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RARITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Points and Display Order */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-points_reward">
                Puntos de Recompensa <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-points_reward"
                type="number"
                min="0"
                value={formData.points_reward}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    points_reward: parseInt(e.target.value) || 0,
                  }))
                }
              />
              {errors.points_reward && (
                <p className="text-sm text-destructive">{errors.points_reward}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-display_order">Orden de Visualización</Label>
              <Input
                id="edit-display_order"
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    display_order: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          {/* Icon URL */}
          <div className="space-y-2">
            <Label htmlFor="edit-icon_url">URL del Icono</Label>
            <Input
              id="edit-icon_url"
              type="url"
              placeholder="https://ejemplo.com/icono.png"
              value={formData.icon_url}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, icon_url: e.target.value }))
              }
            />
            <p className="text-xs text-muted-foreground">
              Opcional: URL de la imagen del badge
            </p>
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="edit-is_secret">Badge Secreto</Label>
                <p className="text-sm text-muted-foreground">
                  Los badges secretos solo se revelan cuando se ganan
                </p>
              </div>
              <Switch
                id="edit-is_secret"
                checked={formData.is_secret}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_secret: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="edit-is_active">Badge Activo</Label>
                <p className="text-sm text-muted-foreground">
                  Solo los badges activos pueden ser ganados
                </p>
              </div>
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </div>

          {/* Stats Info */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="text-sm font-medium">Estadísticas del Badge</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Veces ganado:</span>
                <span className="ml-2 font-medium">{badge.earned_count}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Tasa de logro:</span>
                <span className="ml-2 font-medium">{badge.earn_rate?.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
