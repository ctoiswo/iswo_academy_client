import { useEffect, useState } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Layout route for all /$academySlug/* routes.
 * Syncs currentAcademy using the user's membership data (with correct role).
 * Falls back to refreshAcademies() if the academy is not yet in the store.
 */
function AcademySlugLayout() {
  const { academySlug } = Route.useParams()
  const { currentAcademy } = useAuthStore()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const needsSync = !currentAcademy || currentAcademy.slug !== academySlug

  useEffect(() => {
    if (!needsSync) return

    const { academyData, setCurrentAcademy, refreshAcademies } =
      useAuthStore.getState()

    // Look up the user's membership by slug — this has the correct user_role
    const membership = academyData?.academies?.find(
      (a) => a.slug === academySlug
    )
    if (membership) {
      setCurrentAcademy(membership)
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
