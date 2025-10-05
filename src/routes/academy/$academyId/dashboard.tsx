import { createFileRoute } from '@tanstack/react-router'
import { DashboardRouter } from '@/components/dashboard-router'
import { useAuthStore } from '@/stores/auth-store'
import { DashboardFallback } from '@/components/dashboard-fallback'

function AcademyDashboard() {
  const { user, currentAcademy } = useAuthStore()
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="mt-2 text-muted-foreground">Please log in to access the dashboard.</p>
        </div>
      </div>
    )
  }
  
  return (
    <DashboardRouter 
      user={user} 
      currentAcademy={currentAcademy}
      fallbackComponent={DashboardFallback}
    />
  )
}

export const Route = createFileRoute('/academy/$academyId/dashboard')({
  component: AcademyDashboard,
})