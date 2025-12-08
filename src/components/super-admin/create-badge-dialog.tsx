import { useState } from 'react'
import superAdminGamificationService, {
  type CreateBadgeData,
} from '@/services/super-admin-gamification-service'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface BadgeFormData {
  name?: string
  slug?: string
  description?: string
  category?: string
  tier?: string
  rarity?: string
  points_reward?: number
  icon_url?: string
  is_secret?: boolean
  is_active?: boolean
  display_order?: number
}

interface CreateBadgeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function CreateBadgeDialog({
  open,
  onOpenChange,
  academySlug,
  onSuccess,
}: CreateBadgeDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<BadgeFormData>>({
    category: 'milestone',
    tier: 'bronze',
    rarity: 'common',
    points_reward: 50,
    is_secret: false,
    is_active: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres'
    }

    if (!formData.slug || formData.slug.length < 3) {
      newErrors.slug = 'El slug debe tener al menos 3 caracteres'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        'El slug solo puede contener letras minúsculas, números y guiones'
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres'
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría'
    }

    if (!formData.tier) {
      newErrors.tier = 'Selecciona un nivel'
    }

    if (!formData.rarity) {
      newErrors.rarity = 'Selecciona una rareza'
    }

    if (formData.points_reward === undefined || formData.points_reward < 0) {
      newErrors.points_reward = 'Los puntos deben ser mayores o iguales a 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const badgeData: CreateBadgeData = {
        name: formData.name!,
        slug: formData.slug!,
        description: formData.description!,
        category: formData.category!,
        tier: formData.tier!,
        rarity: formData.rarity!,
        points_reward: formData.points_reward!,
        icon_url: formData.icon_url,
        is_secret: formData.is_secret,
        is_active: formData.is_active,
        display_order: formData.display_order,
      }

      await superAdminGamificationService.createBadge(academySlug, badgeData)

      toast.success('Badge creado correctamente')
      onSuccess()
      onOpenChange(false)

      // Reset form
      setFormData({
        category: 'milestone',
        tier: 'bronze',
        rarity: 'common',
        points_reward: 50,
        is_secret: false,
        is_active: true,
      })
      setErrors({})
    } catch (error: any) {
      // console.error('Error creating badge:', error)
      toast.error(error.response?.data?.message || 'No se pudo crear el badge')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Badge</DialogTitle>
          <DialogDescription>
            Completa los datos para crear un nuevo badge para la academia
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>
              Nombre <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='name'
              placeholder='Ejemplo: Primer Curso Completado'
              value={formData.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
            />
            {errors.name && (
              <p className='text-destructive text-sm'>{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className='space-y-2'>
            <Label htmlFor='slug'>
              Slug <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='slug'
              placeholder='primer-curso-completado'
              value={formData.slug || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
            />
            <p className='text-muted-foreground text-xs'>
              Identificador único (solo letras minúsculas, números y guiones)
            </p>
            {errors.slug && (
              <p className='text-destructive text-sm'>{errors.slug}</p>
            )}
          </div>

          {/* Description */}
          <div className='space-y-2'>
            <Label htmlFor='description'>
              Descripción <span className='text-destructive'>*</span>
            </Label>
            <Textarea
              id='description'
              placeholder='Describe qué logro representa este badge...'
              value={formData.description || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
            {errors.description && (
              <p className='text-destructive text-sm'>{errors.description}</p>
            )}
          </div>

          {/* Category, Tier, Rarity */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='category'>
                Categoría <span className='text-destructive'>*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger id='category'>
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
              {errors.category && (
                <p className='text-destructive text-sm'>{errors.category}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='tier'>
                Nivel <span className='text-destructive'>*</span>
              </Label>
              <Select
                value={formData.tier}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, tier: value }))
                }
              >
                <SelectTrigger id='tier'>
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
              {errors.tier && (
                <p className='text-destructive text-sm'>{errors.tier}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='rarity'>
                Rareza <span className='text-destructive'>*</span>
              </Label>
              <Select
                value={formData.rarity}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, rarity: value }))
                }
              >
                <SelectTrigger id='rarity'>
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
              {errors.rarity && (
                <p className='text-destructive text-sm'>{errors.rarity}</p>
              )}
            </div>
          </div>

          {/* Points and Display Order */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='points_reward'>
                Puntos de Recompensa <span className='text-destructive'>*</span>
              </Label>
              <Input
                id='points_reward'
                type='number'
                min='0'
                value={formData.points_reward || 0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    points_reward: parseInt(e.target.value) || 0,
                  }))
                }
              />
              {errors.points_reward && (
                <p className='text-destructive text-sm'>
                  {errors.points_reward}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='display_order'>Orden de Visualización</Label>
              <Input
                id='display_order'
                type='number'
                min='0'
                placeholder='Opcional'
                value={formData.display_order || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    display_order: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  }))
                }
              />
            </div>
          </div>

          {/* Icon URL */}
          <div className='space-y-2'>
            <Label htmlFor='icon_url'>URL del Icono</Label>
            <Input
              id='icon_url'
              type='url'
              placeholder='https://ejemplo.com/icono.png'
              value={formData.icon_url || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, icon_url: e.target.value }))
              }
            />
            <p className='text-muted-foreground text-xs'>
              Opcional: URL de la imagen del badge
            </p>
          </div>

          {/* Switches */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='is_secret'>Badge Secreto</Label>
                <p className='text-muted-foreground text-sm'>
                  Los badges secretos solo se revelan cuando se ganan
                </p>
              </div>
              <Switch
                id='is_secret'
                checked={formData.is_secret}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_secret: checked }))
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='is_active'>Badge Activo</Label>
                <p className='text-muted-foreground text-sm'>
                  Solo los badges activos pueden ser ganados
                </p>
              </div>
              <Switch
                id='is_active'
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Badge'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
