import { useState, useEffect } from 'react'
import type { DashboardProps } from '@/components/dashboard-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useStudentDashboard } from '@/hooks/use-student-dashboard'
import { WelcomeHero } from './containers/welcome-hero'
import { StatsSection } from './containers/stats-section'
import { ContinueLearning } from './containers/continue-learning'
import { PendingTasks } from './containers/pending-tasks'
import { LearningPathsSection } from './containers/learning-paths-section'
import { AchievementsSection } from './containers/achievements-section'

export function StudentDashboard({ user, academy }: DashboardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!user) return null

  const academySlug = academy?.slug ?? 'default'
  const firstName = user.first_name ?? 'estudiante'

  const { data: dashboardData, isLoading } = useStudentDashboard(academySlug)
  const dashboardContent = dashboardData?.data

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
      <div className='flex flex-col gap-8'>
        <WelcomeHero
          firstName={firstName}
          pendingTasksCount={dashboardContent?.pending_assignments.length ?? 0}
          mounted={mounted}
        />
        <StatsSection
          mounted={mounted}
          academySlug={academySlug}
          currentStreak={dashboardContent?.streak?.current_streak}
        />
        <ContinueLearning mounted={mounted} academySlug={academySlug} />
        <PendingTasks
          mounted={mounted}
          assignments={dashboardContent?.pending_assignments ?? []}
          isLoading={isLoading}
        />
        <LearningPathsSection
          mounted={mounted}
          academySlug={academySlug}
          enrollments={dashboardContent?.learning_path_enrollments ?? []}
          isLoading={isLoading}
        />
        <AchievementsSection
          mounted={mounted}
          achievements={dashboardContent?.user_achievements ?? []}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  )
}
