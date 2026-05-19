import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, Users, TrendingUp, ClipboardCheck } from 'lucide-react'
import { teacherQueries } from '@/lib/api/teacher'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { DashboardProps } from '@/components/dashboard-router'
import { StatCard } from '@/components/dashboard/stat-card'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ContentManagement } from './components/content-management'
import { MyCourses } from './components/my-courses'
import { StudentProgress } from './components/student-progress'

export function TeacherDashboard({ user, academy }: DashboardProps) {
  const academySlug = academy?.slug ?? ''
  const teacherId = user?.id ?? 0
  const enabled = !!teacherId && !!academySlug
  const navigate = useNavigate()

  const { data: statsData, isLoading: loadingStats } = useQuery({
    ...teacherQueries.stats(teacherId, academySlug),
    enabled,
  })

  const { data: coursesData, isLoading: loadingCourses } = useQuery({
    ...teacherQueries.courses(teacherId, academySlug),
    enabled,
  })

  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    ...teacherQueries.studentProgress(teacherId, academySlug),
    enabled,
  })

  const { data: lessonsData, isLoading: loadingLessons } = useQuery({
    ...teacherQueries.lessons(teacherId, academySlug),
    enabled,
  })

  const { data: assignmentsData, isLoading: loadingAssignments } = useQuery({
    ...teacherQueries.assignments(teacherId, academySlug),
    enabled,
  })

  const stats = statsData
  const courses = coursesData?.data ?? []
  const students = studentsData?.data ?? []
  const lessons = lessonsData?.data ?? []
  const assignments = assignmentsData?.data ?? []

  if (!user) return null

  return (
    <DashboardLayout
      user={user}
      academy={academy}
      variant='full'
      dashboardType='teacher'
    >
      <div className='w-full space-y-6'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Panel de Enseñanza
          </h1>
          <p className='text-muted-foreground text-sm'>
            Gestiona tus cursos y el progreso de tus estudiantes
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
          <StatCard
            label='Mis Cursos'
            value={stats?.totalCourses ?? courses.length}
            icon={BookOpen}
            iconBg='bg-primary/10'
            iconColor='text-primary'
            loading={loadingStats}
          />
          <StatCard
            label='Estudiantes'
            value={stats?.totalStudents ?? 0}
            icon={Users}
            iconBg='bg-emerald-500/10'
            iconColor='text-emerald-400'
            loading={loadingStats}
          />
          <StatCard
            label='Finalización'
            value={stats ? `${stats.averageCompletionRate}%` : '—'}
            icon={TrendingUp}
            iconBg='bg-sky-500/10'
            iconColor='text-sky-400'
            loading={loadingStats}
          />
          <StatCard
            label='Pendientes'
            value={stats?.pendingReviews ?? 0}
            icon={ClipboardCheck}
            iconBg='bg-amber-500/10'
            iconColor='text-amber-400'
            loading={loadingStats}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue='courses' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='courses'>Mis Cursos</TabsTrigger>
            <TabsTrigger value='students'>Progreso Estudiantes</TabsTrigger>
            <TabsTrigger value='content'>Gestión de Contenido</TabsTrigger>
          </TabsList>

          <TabsContent value='courses'>
            <MyCourses
              courses={courses}
              loading={loadingCourses}
              onCreateCourse={() => {}}
              onEditCourse={(_id, slug) =>
                slug &&
                navigate({
                  to: '/academy/$academySlug/courses/$courseSlug/edit',
                  params: { academySlug, courseSlug: slug },
                })
              }
              onViewCourse={(_id, slug) =>
                slug &&
                navigate({
                  to: '/academy/$academySlug/courses/$courseSlug/info',
                  params: { academySlug, courseSlug: slug },
                })
              }
              onManageCourse={(_id, slug) =>
                slug &&
                navigate({
                  to: '/academy/$academySlug/courses/$courseSlug/settings',
                  params: { academySlug, courseSlug: slug },
                })
              }
            />
          </TabsContent>

          <TabsContent value='students'>
            <StudentProgress
              students={students}
              courses={courses}
              loading={loadingStudents}
              onViewStudent={() => {}}
              onMessageStudent={() => {}}
              onViewProgress={() => {}}
            />
          </TabsContent>

          <TabsContent value='content'>
            <ContentManagement
              courses={courses}
              lessons={lessons}
              assignments={assignments}
              loading={loadingLessons || loadingAssignments}
              onCreateLesson={() => {}}
              onCreateAssignment={() => {}}
              onEditLesson={() => {}}
              onEditAssignment={() => {}}
              onViewLesson={() => {}}
              onDeleteLesson={() => {}}
              onDeleteAssignment={() => {}}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
