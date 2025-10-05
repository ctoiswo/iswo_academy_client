import type { DashboardProps } from '@/components/dashboard-router'

export function DashboardFallback({ user, academy }: DashboardProps) {
  if (!user) return null
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Dashboard Coming Soon
        </h2>
        <p className="mt-2 text-muted-foreground">
          The dashboard for your role is being developed.
        </p>
        {academy && (
          <p className="mt-1 text-sm text-muted-foreground">
            Academy: {academy.name} | Role: {academy.user_role_display}
          </p>
        )}
      </div>
    </div>
  )
}