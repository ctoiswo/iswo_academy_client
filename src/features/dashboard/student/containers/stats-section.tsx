import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { PlayCircle, CheckCircle2, Bookmark, Flame } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useUserEnrollments } from '@/hooks/use-enrollments'
import { useWishlist } from '@/hooks/use-wishlist'

interface StatsSectionProps {
  mounted: boolean
  academySlug: string
  currentStreak?: number
}

export function StatsSection({
  mounted,
  academySlug,
  currentStreak = 0,
}: StatsSectionProps) {
  const { t } = useTranslation()
  const s = 'dashboard.student.stats'
  const navigate = useNavigate()

  const { data: allEnrollments, isLoading } = useUserEnrollments()
  const { data: activeEnrollments } = useUserEnrollments({ status: 'active' })
  const { data: completedEnrollments } = useUserEnrollments({
    status: 'completed',
  })
  const { coursesCount } = useWishlist()

  const stats = useMemo(() => {
    const active = activeEnrollments?.enrollments?.length ?? 0
    const completed = completedEnrollments?.enrollments?.length ?? 0
    return { active, completed, saved: coursesCount, streak: currentStreak }
  }, [
    allEnrollments,
    activeEnrollments,
    completedEnrollments,
    coursesCount,
    currentStreak,
  ])

  const items = [
    {
      label: t(`${s}.inProgress`),
      value: isLoading ? '—' : stats.active,
      icon: PlayCircle,
      accent: 'text-primary',
      bg: 'bg-primary/10',
      border: 'hover:border-primary/40',
      onClick: () =>
        navigate({
          to: '/academy/$academySlug/my-courses',
          params: { academySlug },
          search: { status: 'active' },
        }),
    },
    {
      label: t(`${s}.completed`),
      value: isLoading ? '—' : stats.completed,
      icon: CheckCircle2,
      accent: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'hover:border-emerald-500/40',
      onClick: () =>
        navigate({
          to: '/academy/$academySlug/my-courses',
          params: { academySlug },
          search: { status: 'completed' },
        }),
    },
    {
      label: t(`${s}.saved`),
      value: isLoading ? '—' : stats.saved,
      icon: Bookmark,
      accent: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'hover:border-amber-500/40',
      onClick: () =>
        navigate({
          to: '/academy/$academySlug/my-courses',
          params: { academySlug },
          search: { status: 'wishlist' },
        }),
    },
    {
      label: t(`${s}.streak`),
      value: stats.streak,
      icon: Flame,
      accent: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'hover:border-orange-500/40',
      special: true,
      onClick: undefined as (() => void) | undefined,
    },
  ]

  return (
    <section
      className={cn(
        'grid grid-cols-2 gap-3 lg:grid-cols-4',
        'transition-all delay-100 duration-700',
        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
    >
      {items.map((stat, index) => {
        const Icon = stat.icon
        return (
          <button
            key={stat.label}
            type='button'
            className={cn(
              'group border-border/60 bg-card relative flex items-center gap-3 rounded-xl border p-4 text-left',
              'transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)]',
              stat.border,
              'special' in stat && stat.special && 'ring-1 ring-orange-500/20',
              stat.onClick
                ? 'cursor-pointer hover:-translate-y-0.5'
                : 'cursor-default'
            )}
            style={{ transitionDelay: `${index * 50}ms` }}
            onClick={stat.onClick}
            disabled={!stat.onClick}
          >
            {'special' in stat && stat.special && (
              <div className='absolute -top-px -right-px'>
                <div className='text-background rounded-tr-xl rounded-bl-lg bg-gradient-to-r from-orange-500 to-amber-500 px-2 py-0.5 text-[10px] font-bold'>
                  RACHA
                </div>
              </div>
            )}
            <div
              className={cn(
                'flex size-11 items-center justify-center rounded-xl',
                stat.bg
              )}
            >
              <Icon className={cn('size-5', stat.accent)} />
            </div>
            <div className='flex flex-col'>
              <span className='text-foreground text-2xl font-bold'>
                {stat.value}
              </span>
              <span className='text-muted-foreground text-[11px]'>
                {stat.label}
              </span>
            </div>
          </button>
        )
      })}
    </section>
  )
}
