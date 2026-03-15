import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Award, Trophy } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { gamificationService } from '@/services/gamification-service'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BadgeIcon, getVisualConfig } from '@/components/gamification/badge-visual-config'

const TIER_STYLES: Record<string, { label: string; className: string }> = {
  bronze: { label: 'Bronce', className: 'border-amber-700 bg-amber-700/10 text-amber-700' },
  silver: { label: 'Plata', className: 'border-slate-400 bg-slate-400/10 text-slate-500' },
  gold: { label: 'Oro', className: 'border-yellow-500 bg-yellow-500/10 text-yellow-600' },
  platinum: { label: 'Platino', className: 'border-cyan-400 bg-cyan-400/10 text-cyan-500' },
  diamond: { label: 'Diamante', className: 'border-purple-400 bg-purple-400/10 text-purple-500' },
}

export default function MyBadgesPage() {
  const { t } = useTranslation()
  const { user, currentAcademy } = useAuthStore()
  const { academySlug } = useParams({ strict: false }) as { academySlug?: string }

  const { data: earnedBadges = [], isLoading } = useQuery({
    queryKey: ['earned-badges', academySlug],
    queryFn: () => gamificationService.getEarnedBadges(academySlug ?? ''),
    enabled: !!academySlug,
  })

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='student'
    >
      <div className='space-y-6'>
        {/* Header */}
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-bold'>
            <Trophy className='text-primary size-6' />
            Mis Insignias
          </h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Insignias que has ganado en esta academia
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='h-40 rounded-xl' />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && earnedBadges.length === 0 && (
          <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center'>
            <Award className='text-muted-foreground/40 size-14' />
            <p className='text-muted-foreground mt-4 text-base font-medium'>
              Aún no tienes insignias
            </p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Completa cursos y actividades para ganar tus primeras insignias
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && earnedBadges.length > 0 && (
          <>
            <p className='text-muted-foreground text-sm'>
              {earnedBadges.length}{' '}
              {earnedBadges.length === 1 ? 'insignia ganada' : 'insignias ganadas'}
            </p>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {earnedBadges.map((userBadge) => {
                // Backend returns flat structure: badge fields + earned_at at top level
                const badge = (userBadge.badge ?? userBadge) as any
                const tier = TIER_STYLES[badge.tier] ?? TIER_STYLES.bronze
                const visual = getVisualConfig(badge.slug ?? '', badge.tier ?? 'bronze')
                const earnedAt = userBadge.earned_at ?? (userBadge as any).earned_at
                const badgeName = badge.slug
                  ? t(`badges.${badge.slug}.name`, { defaultValue: badge.name })
                  : badge.name
                const badgeDescription = badge.slug
                  ? t(`badges.${badge.slug}.description`, { defaultValue: badge.description })
                  : badge.description
                return (
                  <Card
                    key={userBadge.id}
                    className='hover:border-primary/40 transition-colors'
                  >
                    <CardContent className='flex flex-col items-center gap-3 p-5 text-center'>
                      {badge.icon_url ? (
                        <div
                          className={cn(
                            'flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br p-0.5',
                            visual.gradient
                          )}
                        >
                          <div className='bg-card flex size-full items-center justify-center rounded-full'>
                            <img
                              src={badge.icon_url}
                              alt={badge.name}
                              className='size-9 object-contain'
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            'flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br p-0.5',
                            visual.gradient
                          )}
                        >
                          <div className='bg-card flex size-full items-center justify-center rounded-full'>
                            <BadgeIcon slug={badge.slug ?? ''} className='text-primary size-9' />
                          </div>
                        </div>
                      )}
                      <div className='space-y-1'>
                        <p className='text-sm font-semibold leading-tight'>
                          {badgeName}
                        </p>
                        <p className='text-muted-foreground line-clamp-2 text-xs'>
                          {badgeDescription}
                        </p>
                      </div>
                      <Badge variant='outline' className={tier.className}>
                        {tier.label}
                      </Badge>
                      <p className='text-muted-foreground text-xs'>
                        {earnedAt ? formatDate(earnedAt) : '—'}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
