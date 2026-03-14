import { useQuery } from '@tanstack/react-query'
import { Users, BookOpen, DollarSign, UserCheck } from 'lucide-react'
import type { AcademyMembership } from '@/stores/auth-store'
import { academyAdminQueries } from '@/lib/api/academy-admin'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { StatCard } from '@/components/dashboard/stat-card'

export interface AcademyStats {
  totalStudents: number
  totalTeachers: number
  totalCourses: number
  academyRevenue: number
  monthlyGrowth: {
    students: number
    teachers: number
    courses: number
    revenue: number
  }
  enrollmentTrends: {
    month: string
    enrollments: number
  }[]
  topCourses: {
    id: number
    title: string
    enrollments: number
    revenue: number
  }[]
}

interface AcademyStatsOverviewProps {
  academy: AcademyMembership
  loading?: boolean
}

export function AcademyStatsOverview({
  academy,
  loading = false,
}: AcademyStatsOverviewProps) {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    ...academyAdminQueries.stats(academy.slug || academy.id),
    enabled: !!(academy?.slug || academy?.id) && !loading,
  })

  if (error) {
    return (
      <DashboardCard title='Error' variant='outline'>
        <p className='text-destructive'>
          Error al cargar las estadísticas. Por favor intenta de nuevo.
        </p>
      </DashboardCard>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Main Statistics Grid */}
      <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
        <StatCard
          label='Total Estudiantes'
          value={isLoading ? '—' : (stats?.totalStudents ?? 0).toLocaleString()}
          icon={Users}
          iconBg='bg-emerald-500/10'
          iconColor='text-emerald-400'
          loading={isLoading}
          description='Estudiantes activos inscritos'
        />

        <StatCard
          label='Total Profesores'
          value={isLoading ? '—' : (stats?.totalTeachers ?? 0).toLocaleString()}
          icon={UserCheck}
          iconBg='bg-primary/10'
          iconColor='text-primary'
          loading={isLoading}
          description='Personal docente activo'
        />

        <StatCard
          label='Cursos Activos'
          value={isLoading ? '—' : (stats?.totalCourses ?? 0).toLocaleString()}
          icon={BookOpen}
          iconBg='bg-violet-500/10'
          iconColor='text-violet-400'
          loading={isLoading}
          description='Cursos publicados'
        />

        <StatCard
          label='Ingresos'
          value={
            isLoading
              ? '—'
              : new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(stats?.academyRevenue ?? 0)
          }
          icon={DollarSign}
          iconBg='bg-amber-500/10'
          iconColor='text-amber-400'
          loading={isLoading}
          description='Ingresos mensuales totales'
        />
      </div>

      {/* Additional Analytics */}
      <div className='grid gap-6 md:grid-cols-2'>
        {/* Enrollment Trends */}
        <DashboardCard
          title='Tendencias de Inscripción'
          description='Crecimiento mensual de inscripciones'
          loading={isLoading}
        >
          {stats?.enrollmentTrends && (
            <div className='space-y-3'>
              {stats.enrollmentTrends.slice(-3).map((trend) => (
                <div
                  key={trend.month}
                  className='flex items-center justify-between'
                >
                  <span className='text-sm font-medium'>{trend.month}</span>
                  <div className='flex items-center space-x-2'>
                    <div className='bg-muted h-2 w-24 rounded-full'>
                      <div
                        className='bg-primary h-2 rounded-full transition-all duration-300'
                        style={{
                          width: `${(trend.enrollments / Math.max(...stats.enrollmentTrends.map((t) => t.enrollments))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className='text-muted-foreground w-12 text-right text-sm'>
                      {trend.enrollments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        {/* Top Performing Courses */}
        <DashboardCard
          title='Cursos Más Populares'
          description='Mayor inscripción e ingresos'
          loading={isLoading}
        >
          {stats?.topCourses && (
            <div className='space-y-4'>
              {stats.topCourses.map((course, index) => (
                <div
                  key={course.id}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium'>
                      {index + 1}
                    </div>
                    <div>
                      <p className='text-sm font-medium'>{course.title}</p>
                      <p className='text-muted-foreground text-xs'>
                        {course.enrollments} estudiantes
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium'>
                      ${course.revenue.toLocaleString()}
                    </p>
                    <p className='text-muted-foreground text-xs'>ingresos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  )
}
