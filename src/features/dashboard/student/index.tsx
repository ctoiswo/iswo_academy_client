
import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { BookOpen, GraduationCap, Award } from 'lucide-react'
import { useUserEnrollments } from '@/hooks/use-enrollments'
import { useWishlist } from '@/hooks/use-wishlist'
import type { DashboardProps } from '@/components/dashboard-router'

export function StudentDashboard({ user, academy }: DashboardProps) {
  const navigate = useNavigate()
  
  // Get academy slug for navigation
  const academySlug = academy?.slug || 'default'
  
  // Fetch enrollments data
  const { data: allEnrollments, isLoading } = useUserEnrollments()
  const { data: activeEnrollments } = useUserEnrollments({ status: 'active' })
  const { data: completedEnrollments } = useUserEnrollments({ status: 'completed' })
  
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
      studyStreak: 0 // TODO: Implement study streak tracking
    }
  }, [allEnrollments, activeEnrollments, completedEnrollments, coursesCount])

  if (!user) return null

  return (
    <DashboardLayout
      user={user}
      academy={academy}
      variant="compact"
      dashboardType="student"
      topNavLinks={undefined}
      showSearch={false}
      showConfigDrawer={false}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mi Aprendizaje</h1>
          <p className="text-muted-foreground">
            Continúa tu viaje de aprendizaje y sigue tu progreso
          </p>
        </div>
        
        {/* Learning Categories Grid - 2 columns x 2 rows */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cursos en Progreso */}
          <button
            onClick={() => navigate({ 
              to: '/academy/$academySlug/my-courses', 
              params: { academySlug },
              search: { status: 'active' } 
            })}
            className="group relative overflow-hidden rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-8 text-left transition-all hover:border-blue-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-blue-500 p-3 text-white">
                  <BookOpen className="h-8 w-8" />
                </div>
                {!isLoading && (
                  <span className="text-4xl font-bold text-blue-600">
                    {stats.activeCount}
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-blue-900">
                Cursos en Progreso
              </h3>
              <p className="text-sm text-blue-700">
                Continúa donde lo dejaste
              </p>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10">
              <BookOpen className="h-32 w-32 text-blue-600" />
            </div>
          </button>

          {/* Cursos Completados */}
          <button
            onClick={() => navigate({ 
              to: '/academy/$academySlug/my-courses', 
              params: { academySlug },
              search: { status: 'completed' } 
            })}
            className="group relative overflow-hidden rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-8 text-left transition-all hover:border-green-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-green-500 p-3 text-white">
                  <GraduationCap className="h-8 w-8" />
                </div>
                {!isLoading && (
                  <span className="text-4xl font-bold text-green-600">
                    {stats.completedCount}
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-green-900">
                Cursos Finalizados
              </h3>
              <p className="text-sm text-green-700">
                Revisa tus logros completados
              </p>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10">
              <GraduationCap className="h-32 w-32 text-green-600" />
            </div>
          </button>

          {/* Todos los Cursos */}
          <button
            onClick={() => navigate({ 
              to: '/academy/$academySlug/my-courses', 
              params: { academySlug }
            })}
            className="group relative overflow-hidden rounded-lg border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-8 text-left transition-all hover:border-orange-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-purple-500 p-3 text-white">
                  <Award className="h-8 w-8" />
                </div>
                {!isLoading && (
                  <span className="text-4xl font-bold text-purple-600">
                    {stats.totalCount}
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-purple-900">
                Todos mis Cursos
              </h3>
              <p className="text-sm text-purple-700">
                Ver todos tus cursos inscritos
              </p>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10">
              <Award className="h-32 w-32 text-purple-600" />
            </div>
          </button>

          {/* Cursos Guardados */}
          <button
            onClick={() => navigate({ 
              to: '/academy/$academySlug/my-courses', 
              params: { academySlug },
              search: { status: 'wishlist' } 
            })}
            className="group relative overflow-hidden rounded-lg border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100 p-8 text-left transition-all hover:border-pink-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-pink-500 p-3 text-white">
                  <Award className="h-8 w-8" />
                </div>
                {!isLoading && (
                  <span className="text-4xl font-bold text-pink-600">
                    {stats.savedCount}
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-pink-900">
                Cursos Guardados
              </h3>
              <p className="text-sm text-pink-700">
                Revisa tu lista de deseos
              </p>
            </div>
            <div className="absolute bottom-0 right-0 opacity-10">
              <Award className="h-32 w-32 text-pink-600" />
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}