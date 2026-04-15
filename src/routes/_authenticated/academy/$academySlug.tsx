import { useEffect } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth-store'
import academyService from '@/services/academy-service'
import { Skeleton } from '@/components/ui/skeleton'
import type { AcademyMembership } from '@/types'

/**
 * Layout route for all /$academySlug/* routes.
 * For super admin: syncs currentAcademy whenever the URL slug changes.
 * Regular users: passes through (their currentAcademy is managed by normal auth flow).
 */
function AcademySlugLayout() {
  const { academySlug } = Route.useParams()
  const { user, currentAcademy, setCurrentAcademy } = useAuthStore()

  // Sync needed when super admin and current academy doesn't match URL
  const needsSync =
    !!user?.is_super_admin && currentAcademy?.slug !== academySlug

  const { data: fetchedAcademy, isLoading: isFetching } = useQuery({
    queryKey: ['academy', academySlug, 'full'],
    queryFn: () => academyService.getAcademyBySlug(academySlug),
    enabled: needsSync && !!academySlug,
    staleTime: 30_000,
  })

  useEffect(() => {
    if (!fetchedAcademy || !needsSync) return
    const membership: AcademyMembership = {
      id: fetchedAcademy.id,
      name: fetchedAcademy.name,
      slug: fetchedAcademy.slug,
      description: fetchedAcademy.description ?? '',
      logo_url: fetchedAcademy.logo_url ?? null,
      user_role: 'admin',
      user_role_display: 'Administrador',
      created_at: fetchedAcademy.created_at,
      last_accessed: null,
      last_accessed_at: null,
      admin_subscription_active: fetchedAcademy.admin_subscription_active,
      subscription_expires_at: fetchedAcademy.subscription_expires_at,
      admin_subscription_days_remaining:
        fetchedAcademy.admin_subscription_days_remaining,
      status: fetchedAcademy.status,
    }
    setCurrentAcademy(membership)
  }, [fetchedAcademy, needsSync, setCurrentAcademy])

  if (needsSync && isFetching) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='w-full max-w-lg space-y-4 px-8'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-72' />
          <Skeleton className='h-32 w-full' />
        </div>
      </div>
    )
  }

  return <Outlet />
}

export const Route = createFileRoute('/_authenticated/academy/$academySlug')({
  component: AcademySlugLayout,
})
