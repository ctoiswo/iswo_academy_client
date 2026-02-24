import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, GraduationCap, PlayCircle, Bookmark } from 'lucide-react'
import { useUserEnrollments } from '@/hooks/use-enrollments'
import { useWishlist } from '@/hooks/use-wishlist'
import type { DashboardProps } from '@/components/dashboard-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatCard } from '@/components/dashboard/stat-card'

export function StudentDashboard({ user, academy }: DashboardProps) {
  const navigate = useNavigate()

  // Get academy slug for navigation
  const academySlug = academy?.slug || 'default'

  // Fetch enrollments data
  const { data: allEnrollments, isLoading } = useUserEnrollments()
  const { data: activeEnrollments } = useUserEnrollments({ status: 'active' })
  const { data: completedEnrollments } = useUserEnrollments({
    status: 'completed',
  })

  // Get wishlist data
  const { coursesCount } = useWishlist()

  // Calculate stats from real data
  const stats = useMemo(() => {
    const active = activeEnrollments?.enrollments?.length || 0
    const completed = completedEnrollments?.enrollments?.length || 0
    const total = allEnrollments?.enrollments?.length || 0

    return {
      activeCount: active,
      completedCount: completed,
      totalCount: total,
      savedCount: coursesCount,
      studyStreak: 0, // TODO: Implement study streak tracking
    }
  }, [allEnrollments, activeEnrollments, completedEnrollments, coursesCount])

  if (!user) return null

  return (
    <DashboardLayout
      user={user}
      academy={academy}
      variant='compact'
      dashboardType='student'
      topNavLinks={undefined}
      showSearch={false}
      showConfigDrawer={false}
    >
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Mi Aprendizaje</h1>
          <p className='text-muted-foreground'>
            Continúa tu viaje de aprendizaje y sigue tu progreso
          </p>
        </div>

        {/* Learning Categories Grid */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
          <StatCard
            label='En progreso'
            value={isLoading ? '—' : stats.activeCount}
            icon={PlayCircle}
            iconBg='bg-primary/10'
            iconColor='text-primary'
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/my-courses',
                params: { academySlug },
                search: { status: 'active' },
              })
            }
          />

          <StatCard
            label='Completados'
            value={isLoading ? '—' : stats.completedCount}
            icon={GraduationCap}
            iconBg='bg-emerald-500/10'
            iconColor='text-emerald-400'
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/my-courses',
                params: { academySlug },
                search: { status: 'completed' },
              })
            }
          />

          <StatCard
            label='Todos mis cursos'
            value={isLoading ? '—' : stats.totalCount}
            icon={BookOpen}
            iconBg='bg-violet-500/10'
            iconColor='text-violet-400'
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/my-courses',
                params: { academySlug },
              })
            }
          />

          <StatCard
            label='Guardados'
            value={isLoading ? '—' : stats.savedCount}
            icon={Bookmark}
            iconBg='bg-amber-500/10'
            iconColor='text-amber-400'
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/my-courses',
                params: { academySlug },
                search: { status: 'wishlist' },
              })
            }
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
