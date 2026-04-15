import { useState } from 'react'
import { z } from 'zod'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import academyBadgesService, {
  type AdminBadge,
  type BadgeFormData,
} from '@/services/academy-badges-service'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  Award,
  Zap,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  BadgeIcon,
  getVisualConfig,
} from '@/components/gamification/badge-visual-config'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

// ─── Schema ────────────────────────────────────────────────────────────────────

const badgeSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers and hyphens'),
  description: z.string().min(5),
  category: z.string().min(1),
  tier: z.string().min(1),
  rarity: z.string().min(1),
  points_reward: z.number().min(0),
  icon_url: z.string().optional(),
  is_secret: z.boolean(),
  is_active: z.boolean(),
  display_order: z.number().min(0),
  trigger_type: z.string().optional(),
  trigger_conditions_raw: z.string().optional(),
})

type BadgeSchemaValues = z.infer<typeof badgeSchema>

// ─── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORIES = [
  'milestone',
  'social',
  'mastery',
  'streak',
  'special',
  'collection',
  'creator',
]
const TIERS = ['bronze', 'silver', 'gold', 'platinum', 'diamond']
const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary']

function buildFormData(values: BadgeSchemaValues): BadgeFormData {
  let triggerConditions: Record<string, unknown> = {}
  if (values.trigger_conditions_raw) {
    try {
      triggerConditions = JSON.parse(values.trigger_conditions_raw)
    } catch {
      triggerConditions = {}
    }
  }

  const data: BadgeFormData = {
    name: values.name,
    slug: values.slug,
    description: values.description,
    category: values.category,
    tier: values.tier,
    rarity: values.rarity,
    points_reward: values.points_reward,
    icon_url: values.icon_url,
    is_secret: values.is_secret,
    is_active: values.is_active,
    display_order: values.display_order,
  }

  if (values.trigger_type) {
    data.trigger = {
      trigger_type: values.trigger_type,
      is_active: true,
      trigger_conditions: triggerConditions,
    }
  }

  return data
}

// ─── Badge Form Dialog ─────────────────────────────────────────────────────────

interface BadgeFormDialogProps {
  open: boolean
  onClose: () => void
  badge?: AdminBadge | null
  academySlug: string
}

function BadgeFormDialog({
  open,
  onClose,
  badge,
  academySlug,
}: BadgeFormDialogProps) {
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const defaultValues: BadgeSchemaValues = {
    name: badge?.name ?? '',
    slug: badge?.slug ?? '',
    description: badge?.description ?? '',
    category: badge?.category ?? 'milestone',
    tier: badge?.tier ?? 'bronze',
    rarity: badge?.rarity ?? 'common',
    points_reward: badge?.points_reward ?? 10,
    icon_url: badge?.icon_url ?? '',
    is_secret: badge?.is_secret ?? false,
    is_active: badge?.is_active ?? true,
    display_order: badge?.display_order ?? 0,
    trigger_type: badge?.triggers?.[0]?.trigger_type ?? '',
    trigger_conditions_raw: badge?.triggers?.[0]?.trigger_conditions
      ? JSON.stringify(badge.triggers[0].trigger_conditions, null, 2)
      : '',
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<BadgeSchemaValues>({
    resolver: zodResolver(badgeSchema) as Resolver<BadgeSchemaValues>,
    defaultValues,
  })

  const createMutation = useMutation({
    mutationFn: (data: BadgeFormData) =>
      academyBadgesService.createBadge(academySlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['academy-badges', academySlug],
      })
      toast.success(t('academyBadges.createSuccess'))
      onClose()
    },
    onError: () => toast.error(t('academyBadges.createError')),
  })

  const updateMutation = useMutation({
    mutationFn: (data: BadgeFormData) =>
      academyBadgesService.updateBadge(academySlug, badge!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['academy-badges', academySlug],
      })
      toast.success(t('academyBadges.updateSuccess'))
      onClose()
    },
    onError: () => toast.error(t('academyBadges.updateError')),
  })

  const isPending = createMutation.isPending || updateMutation.isPending
  const isEdit = !!badge

  const onSubmit = (values: BadgeSchemaValues) => {
    const data = buildFormData(values)
    if (isEdit) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className='max-h-[90vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t('academyBadges.editBadge')
              : t('academyBadges.newBadge')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 py-2'>
          {/* Name + Slug */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <Label htmlFor='name'>{t('academyBadges.form.name')}</Label>
              <Input id='name' {...register('name')} />
              {errors.name && (
                <p className='text-destructive text-xs'>
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className='space-y-1'>
              <Label htmlFor='slug'>{t('academyBadges.form.slug')}</Label>
              <Input id='slug' {...register('slug')} />
              {errors.slug && (
                <p className='text-destructive text-xs'>
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className='space-y-1'>
            <Label htmlFor='description'>
              {t('academyBadges.form.description')}
            </Label>
            <Textarea id='description' rows={2} {...register('description')} />
            {errors.description && (
              <p className='text-destructive text-xs'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category + Tier + Rarity */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-1'>
              <Label>{t('academyBadges.form.category')}</Label>
              <Controller
                name='category'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {t(`academyBadges.categories.${c}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='space-y-1'>
              <Label>{t('academyBadges.form.tier')}</Label>
              <Controller
                name='tier'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIERS.map((t_) => (
                        <SelectItem key={t_} value={t_}>
                          {t(`academyBadges.tiers.${t_}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className='space-y-1'>
              <Label>{t('academyBadges.form.rarity')}</Label>
              <Controller
                name='rarity'
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RARITIES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {t(`academyBadges.rarities.${r}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Points + Display Order */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <Label htmlFor='points_reward'>
                {t('academyBadges.form.pointsReward')}
              </Label>
              <Input
                id='points_reward'
                type='number'
                min='0'
                {...register('points_reward', { valueAsNumber: true })}
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='display_order'>
                {t('academyBadges.form.displayOrder')}
              </Label>
              <Input
                id='display_order'
                type='number'
                min='0'
                {...register('display_order', { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Icon URL */}
          <div className='space-y-1'>
            <Label htmlFor='icon_url'>{t('academyBadges.form.iconUrl')}</Label>
            <Input
              id='icon_url'
              {...register('icon_url')}
              placeholder='https://...'
            />
          </div>

          {/* Toggles */}
          <div className='flex gap-8'>
            <div className='flex items-center gap-2'>
              <Controller
                name='is_active'
                control={control}
                render={({ field }) => (
                  <Switch
                    id='is_active'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor='is_active'>
                {t('academyBadges.form.isActive')}
              </Label>
            </div>
            <div className='flex items-center gap-2'>
              <Controller
                name='is_secret'
                control={control}
                render={({ field }) => (
                  <Switch
                    id='is_secret'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor='is_secret'>
                {t('academyBadges.form.isSecret')}
              </Label>
            </div>
          </div>

          <Separator />

          {/* Trigger */}
          <div className='space-y-3'>
            <p className='text-sm font-medium'>
              {t('academyBadges.form.trigger')}
            </p>
            <div className='space-y-1'>
              <Label htmlFor='trigger_type'>
                {t('academyBadges.form.triggerType')}
              </Label>
              <Input
                id='trigger_type'
                {...register('trigger_type')}
                placeholder='e.g. course_completed'
              />
            </div>
            {watch('trigger_type') && (
              <div className='space-y-1'>
                <Label htmlFor='trigger_conditions_raw'>
                  {t('academyBadges.form.triggerConditions')}
                </Label>
                <Textarea
                  id='trigger_conditions_raw'
                  rows={3}
                  {...register('trigger_conditions_raw')}
                  placeholder={'{\n  "count": 1\n}'}
                  className='font-mono text-xs'
                />
                <p className='text-muted-foreground text-xs'>
                  {t('academyBadges.form.triggerConditionsHint')}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              disabled={isPending}
            >
              {t('academyBadges.form.cancel')}
            </Button>
            <Button type='submit' disabled={isPending}>
              {isPending
                ? t('academyBadges.form.saving')
                : isEdit
                  ? t('academyBadges.form.save')
                  : t('academyBadges.form.create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Badge Card ────────────────────────────────────────────────────────────────

interface BadgeCardProps {
  badge: AdminBadge
  onEdit: (badge: AdminBadge) => void
  onDelete: (badge: AdminBadge) => void
}

function BadgeCard({ badge, onEdit, onDelete }: BadgeCardProps) {
  const { t } = useTranslation()
  const visual = getVisualConfig(badge.slug, badge.tier)

  return (
    <div
      className={cn(
        'group rounded-xl bg-gradient-to-br p-px transition-shadow hover:shadow-md',
        visual.gradient
      )}
    >
      <Card className='relative h-full overflow-hidden rounded-[11px] border-0'>
        {/* Active indicator */}
        {!badge.is_active && (
          <div className='bg-background/60 absolute inset-0 z-10 flex items-center justify-center'>
            <Badge variant='secondary'>{t('academyBadges.inactive')}</Badge>
          </div>
        )}

        <CardHeader className='px-4 pt-4 pb-2'>
          <div className='flex items-start justify-between gap-2'>
            {/* Icon / placeholder */}
            <div className='flex h-12 w-12 shrink-0 items-center justify-center'>
              {badge.icon_url ? (
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br p-0.5',
                    getVisualConfig(badge.slug, badge.tier).gradient
                  )}
                >
                  <div className='bg-card flex size-full items-center justify-center rounded-full'>
                    <img
                      src={badge.icon_url}
                      alt={badge.name}
                      className='h-7 w-7 object-contain'
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br p-0.5',
                    getVisualConfig(badge.slug, badge.tier).gradient
                  )}
                >
                  <div className='bg-card flex size-full items-center justify-center rounded-full'>
                    <BadgeIcon
                      slug={badge.slug}
                      className='text-primary h-7 w-7'
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7'
                onClick={() => onEdit(badge)}
              >
                <Pencil className='h-3.5 w-3.5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='text-destructive hover:text-destructive h-7 w-7'
                onClick={() => onDelete(badge)}
              >
                <Trash2 className='h-3.5 w-3.5' />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-2 px-4 pb-4'>
          <div>
            <p className='text-sm leading-tight font-semibold'>
              {badge.slug
                ? t(`badges.${badge.slug}.name`, { defaultValue: badge.name })
                : badge.name}
            </p>
            <p className='text-muted-foreground mt-0.5 line-clamp-2 text-xs'>
              {badge.slug
                ? t(`badges.${badge.slug}.description`, {
                    defaultValue: badge.description,
                  })
                : badge.description}
            </p>
          </div>

          <div className='flex flex-wrap gap-1'>
            <Badge
              variant='outline'
              className={cn(
                'gap-1 text-xs capitalize',
                (() => {
                  const tier = badge.tier
                  if (tier === 'bronze')
                    return 'border-amber-700 text-amber-700'
                  if (tier === 'silver')
                    return 'border-slate-400 text-slate-500'
                  if (tier === 'gold')
                    return 'border-yellow-500 text-yellow-600'
                  if (tier === 'platinum')
                    return 'border-cyan-400 text-cyan-500'
                  if (tier === 'diamond')
                    return 'border-purple-400 text-purple-500'
                  return ''
                })()
              )}
            >
              {badge.tier}
            </Badge>
            <Badge variant='outline' className='text-xs capitalize'>
              {badge.rarity}
            </Badge>
            <Badge variant='secondary' className='text-xs capitalize'>
              {badge.category}
            </Badge>
            {badge.is_secret && (
              <Badge variant='destructive' className='text-xs'>
                {t('academyBadges.secret')}
              </Badge>
            )}
          </div>

          <div className='text-muted-foreground flex items-center gap-3 pt-1 text-xs'>
            <span className='flex items-center gap-1'>
              <Star className='h-3 w-3' />
              {badge.points_reward} pts
            </span>
            <span className='flex items-center gap-1'>
              <Users className='h-3 w-3' />
              {badge.earned_count} {t('academyBadges.earned')}
            </span>
            {badge.earn_rate > 0 && <span>{badge.earn_rate}%</span>}
          </div>

          {badge.triggers.length > 0 && (
            <p className='text-muted-foreground flex items-center gap-1 text-xs'>
              <Zap className='h-3 w-3' />
              {badge.triggers[0].trigger_type}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export function AcademyBadgesPage() {
  const { academySlug } = useParams({ strict: false })
  const { user } = useAuthStore()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [tier, setTier] = useState('all')
  const [status, setStatus] = useState('all')
  const [formOpen, setFormOpen] = useState(false)
  const [editBadge, setEditBadge] = useState<AdminBadge | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminBadge | null>(null)

  const { data: badges, isLoading } = useQuery({
    queryKey: ['academy-badges', academySlug, search, category, tier, status],
    queryFn: () =>
      academyBadgesService.getBadges(academySlug!, {
        search: search || undefined,
        category: category !== 'all' ? category : undefined,
        tier: tier !== 'all' ? tier : undefined,
        status:
          status !== 'all' ? (status as 'active' | 'inactive') : undefined,
      }),
    enabled: !!academySlug,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      academyBadgesService.deleteBadge(academySlug!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['academy-badges', academySlug],
      })
      toast.success(t('academyBadges.deleteSuccess'))
      setDeleteTarget(null)
    },
    onError: (error: {
      response?: { data?: { error?: { message?: string } } }
    }) => {
      const msg = error?.response?.data?.error?.message
      toast.error(msg ?? t('academyBadges.deleteError'))
      setDeleteTarget(null)
    },
  })

  const openCreate = () => {
    setEditBadge(null)
    setFormOpen(true)
  }

  const openEdit = (badge: AdminBadge) => {
    setEditBadge(badge)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditBadge(null)
  }

  return (
    <DashboardLayout user={user} variant='full'>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-2xl font-bold'>{t('academyBadges.title')}</h1>
            <p className='text-muted-foreground mt-1'>
              {t('academyBadges.subtitle')}
            </p>
          </div>
          <Button onClick={openCreate} className='gap-2'>
            <Plus className='h-4 w-4' />
            {t('academyBadges.newBadge')}
          </Button>
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-3'>
          <div className='relative min-w-[200px] flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
            <Input
              className='pl-9'
              placeholder={t('academyBadges.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className='w-[160px]'>
              <SelectValue placeholder={t('academyBadges.filterCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>{t('academyBadges.all')}</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {t(`academyBadges.categories.${c}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tier} onValueChange={setTier}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder={t('academyBadges.filterTier')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>{t('academyBadges.all')}</SelectItem>
              {TIERS.map((t_) => (
                <SelectItem key={t_} value={t_}>
                  {t(`academyBadges.tiers.${t_}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder={t('academyBadges.filterStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>{t('academyBadges.all')}</SelectItem>
              <SelectItem value='active'>
                {t('academyBadges.active')}
              </SelectItem>
              <SelectItem value='inactive'>
                {t('academyBadges.inactive')}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Badge count */}
        {!isLoading && badges && (
          <p className='text-muted-foreground text-sm'>
            {badges.length} {t('academyBadges.badgesCount')}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='h-48 rounded-xl' />
            ))}
          </div>
        ) : badges && badges.length > 0 ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {badges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        ) : (
          <div className='text-muted-foreground flex flex-col items-center justify-center gap-3 py-16'>
            <Award className='h-12 w-12 opacity-30' />
            <p>{t('academyBadges.empty')}</p>
            <Button variant='outline' onClick={openCreate}>
              {t('academyBadges.createFirst')}
            </Button>
          </div>
        )}
      </div>

      {/* Create / Edit dialog */}
      {formOpen && (
        <BadgeFormDialog
          open={formOpen}
          onClose={closeForm}
          badge={editBadge}
          academySlug={academySlug!}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('academyBadges.deleteDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('academyBadges.deleteDialog.description', {
                name: deleteTarget?.name ?? '',
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('academyBadges.deleteDialog.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
              }
              disabled={deleteMutation.isPending}
            >
              {t('academyBadges.deleteDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
