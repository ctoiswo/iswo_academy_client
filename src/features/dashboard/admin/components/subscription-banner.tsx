import { Link } from '@tanstack/react-router'
import type { AcademyMembership } from '@/types'
import { AlertTriangle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SubscriptionBannerProps {
  academy: AcademyMembership
}

export function SubscriptionBanner({ academy }: SubscriptionBannerProps) {
  const { admin_subscription_active, subscription_expires_at, admin_subscription_days_remaining, slug, status } = academy

  // Newly created academy — no subscription ever configured
  const isDiscoverMode = status === 'inactive' && !subscription_expires_at
  const isExpired = !isDiscoverMode && !admin_subscription_active
  const isExpiringSoon =
    admin_subscription_active &&
    subscription_expires_at !== null &&
    admin_subscription_days_remaining !== null &&
    admin_subscription_days_remaining <= 7

  if (!isDiscoverMode && !isExpired && !isExpiringSoon) return null

  const subscriptionUrl = `/academy/${slug}/settings/subscription`

  if (isDiscoverMode) {
    return (
      <div className='flex items-center justify-between gap-4 rounded-lg border border-blue-500/40 bg-blue-500/10 px-4 py-3 text-sm text-blue-700 dark:text-blue-400'>
        <div className='flex items-center gap-3'>
          <AlertTriangle className='h-5 w-5 shrink-0' />
          <span className='font-medium'>
            Estás en <strong>modo descubrimiento</strong>. Tu academia aún no tiene un plan activo — no podrás crear cursos, rutas de aprendizaje ni contenido hasta activar tu suscripción.
          </span>
        </div>
        <Button asChild size='sm' variant='outline' className='shrink-0 border-blue-500 text-blue-700 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/10'>
          <Link to={subscriptionUrl as string}>Activar plan</Link>
        </Button>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className='flex items-center justify-between gap-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
        <div className='flex items-center gap-3'>
          <XCircle className='h-5 w-5 shrink-0' />
          <span className='font-medium'>
            Tu academia no tiene un paquete activo. No podrás crear ni editar contenido hasta que actives tu plan.
          </span>
        </div>
        <Button asChild size='sm' variant='destructive' className='shrink-0'>
          <Link to={subscriptionUrl as string}>Ver suscripción</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-between gap-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400'>
      <div className='flex items-center gap-3'>
        <AlertTriangle className='h-5 w-5 shrink-0' />
        <span className='font-medium'>
          Tu suscripción vence en {admin_subscription_days_remaining} día{admin_subscription_days_remaining !== 1 ? 's' : ''}. Renueva tu plan para evitar interrupciones.
        </span>
      </div>
      <Button asChild size='sm' variant='outline' className='shrink-0 border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400/10'>
        <Link to={subscriptionUrl as string}>Ver suscripción</Link>
      </Button>
    </div>
  )
}
