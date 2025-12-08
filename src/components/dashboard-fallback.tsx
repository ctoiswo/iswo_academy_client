import type { DashboardProps } from '@/components/dashboard-router'

export function DashboardFallback({ user, academy }: DashboardProps) {
  if (!user) return null
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-2xl font-bold'>Dashboard Coming Soon</h2>
        <p className='text-muted-foreground mt-2'>
          The dashboard for your role is being developed.
        </p>
        {academy && (
          <p className='text-muted-foreground mt-1 text-sm'>
            Academy: {academy.name} | Role: {academy.user_role_display}
          </p>
        )}
      </div>
    </div>
  )
}
