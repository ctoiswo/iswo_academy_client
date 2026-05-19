import { useEffect, useState } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import academyService from '@/services/academy-service'
import { useAuthStore } from '@/stores/auth-store'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Layout route for all /$academySlug/* routes.
 * Syncs currentAcademy using the user's membership data (with correct role).
 * Falls back to refreshAcademies() if the academy is not yet in the store.
 * For superadmins, fetches the academy directly by slug (no membership needed).
 */
function AcademySlugLayout() {
  const { academySlug } = Route.useParams()
  const { currentAcademy } = useAuthStore()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const needsSync = !currentAcademy || currentAcademy.slug !== academySlug

  useEffect(() => {
    if (!needsSync) return

    const { user, academyData, setCurrentAcademy, refreshAcademies } =
      useAuthStore.getState()

    // Look up the user's membership by slug — this has the correct user_role
    const membership = academyData?.academies?.find(
      (a) => a.slug === academySlug
    )
    if (membership) {
      setCurrentAcademy(membership)
      return
    }

    // Superadmin has no memberships — fetch academy directly by slug
    if (user?.is_super_admin) {
      setIsRefreshing(true)
      academyService
        .getAcademyBySlug(academySlug, 'summary_light')
        .then((academy) => {
          setCurrentAcademy({
            id: academy.id,
            name: academy.name,
            slug: academy.slug,
            description: academy.description,
            logo_url: academy.logo_url,
            user_role: 'admin',
            user_role_display: 'Administrador',
            created_at: new Date().toISOString(),
            last_accessed: null,
            admin_subscription_active: true,
            subscription_expires_at: null,
            admin_subscription_days_remaining: null,
            status: 'active',
          })
          setIsRefreshing(false)
        })
        .catch(() => setIsRefreshing(false))
      return
    }

    // Not found locally — data may be stale (e.g. just enrolled). Refresh.
    setIsRefreshing(true)
    refreshAcademies().then(() => {
      const updated = useAuthStore
        .getState()
        .academyData?.academies?.find((a) => a.slug === academySlug)
      if (updated) {
        useAuthStore.getState().setCurrentAcademy(updated)
      }
      setIsRefreshing(false)
    })
  }, [needsSync, academySlug])

  if (needsSync && isRefreshing) {
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
