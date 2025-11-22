import { useQuery } from '@tanstack/react-query'
import { StatsWidget } from '@/components/dashboard/stats-widget'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, UserCheck } from 'lucide-react'
import { academyAdminQueries } from '@/lib/api/academy-admin'
import type { AcademyMembership } from '@/stores/auth-store'

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

export function AcademyStatsOverview({ academy, loading = false }: AcademyStatsOverviewProps) {
  const { 
    data: stats, 
    isLoading, 
    error 
  } = useQuery({
    ...academyAdminQueries.stats(academy.slug || academy.id),
    enabled: !!(academy?.slug || academy?.id) && !loading,
  })

  const getChangeType = (change: number): 'increase' | 'decrease' | 'neutral' => {
    if (change > 0) return 'increase'
    if (change < 0) return 'decrease'
    return 'neutral'
  }

  if (error) {
    return (
      <DashboardCard title="Error" variant="outline">
        <p className="text-destructive">Error al cargar las estadísticas. Por favor intenta de nuevo.</p>
      </DashboardCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsWidget
          title="Total Estudiantes"
          value={stats?.totalStudents || 0}
          change={stats?.monthlyGrowth.students}
          changeType={getChangeType(stats?.monthlyGrowth.students || 0)}
          icon={Users}
          loading={isLoading}
          format="number"
          description="Estudiantes activos inscritos"
        />
        
        <StatsWidget
          title="Total Profesores"
          value={stats?.totalTeachers || 0}
          change={stats?.monthlyGrowth.teachers}
          changeType={getChangeType(stats?.monthlyGrowth.teachers || 0)}
          icon={UserCheck}
          loading={isLoading}
          format="number"
          description="Personal docente activo"
        />
        
        <StatsWidget
          title="Cursos Activos"
          value={stats?.totalCourses || 0}
          change={stats?.monthlyGrowth.courses}
          changeType={getChangeType(stats?.monthlyGrowth.courses || 0)}
          icon={BookOpen}
          loading={isLoading}
          format="number"
          description="Cursos publicados"
        />
        
        <StatsWidget
          title="Ingresos de la Academia"
          value={stats?.academyRevenue || 0}
          change={stats?.monthlyGrowth.revenue}
          changeType={getChangeType(stats?.monthlyGrowth.revenue || 0)}
          icon={DollarSign}
          loading={isLoading}
          format="currency"
          description="Ingresos mensuales totales"
        />
      </div>

      {/* Additional Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Enrollment Trends */}
        <DashboardCard
          title="Tendencias de Inscripción"
          description="Crecimiento mensual de inscripciones"
          loading={isLoading}
        >
          {stats?.enrollmentTrends && (
            <div className="space-y-3">
              {stats.enrollmentTrends.slice(-3).map((trend, index) => (
                <div key={trend.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{trend.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(trend.enrollments / Math.max(...stats.enrollmentTrends.map(t => t.enrollments))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
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
          title="Cursos Más Populares"
          description="Mayor inscripción e ingresos"
          loading={isLoading}
        >
          {stats?.topCourses && (
            <div className="space-y-4">
              {stats.topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{course.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {course.enrollments} estudiantes
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      ${course.revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">ingresos</p>
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