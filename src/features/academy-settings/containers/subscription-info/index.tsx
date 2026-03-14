import { useAuthStore } from '@/stores/auth-store'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react'

export function SubscriptionInfo() {
  const { currentAcademy } = useAuthStore()

  if (!currentAcademy) return null

  const {
    admin_subscription_active,
    subscription_expires_at,
    admin_subscription_days_remaining,
  } = currentAcademy

  const isGracePeriod = admin_subscription_active && subscription_expires_at === null
  const isExpired = !admin_subscription_active

  const formattedExpiry = subscription_expires_at
    ? new Intl.DateTimeFormat('es', { dateStyle: 'long' }).format(
        new Date(subscription_expires_at)
      )
    : null

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Estado de la suscripción</CardTitle>
          <CardDescription>
            Información sobre el plan activo de tu academia en la plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-muted-foreground'>Estado</span>
            {isExpired ? (
              <Badge variant='destructive'>Expirada</Badge>
            ) : isGracePeriod ? (
              <Badge variant='secondary'>Período de gracia</Badge>
            ) : (
              <Badge className='bg-green-600 text-white hover:bg-green-700'>Activa</Badge>
            )}
          </div>

          <Separator />

          {formattedExpiry && (
            <>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-muted-foreground'>Fecha de vencimiento</span>
                <span className='text-sm font-semibold'>{formattedExpiry}</span>
              </div>
              <Separator />
            </>
          )}

          {admin_subscription_days_remaining !== null && admin_subscription_days_remaining !== undefined && (
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-muted-foreground'>Días restantes</span>
              <span className='text-sm font-semibold'>{admin_subscription_days_remaining} días</span>
            </div>
          )}
        </CardContent>
      </Card>

      {isExpired && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Suscripción vencida</AlertTitle>
          <AlertDescription>
            Tu academia no puede crear ni editar contenido. Contacta al soporte para renovar tu plan.
          </AlertDescription>
        </Alert>
      )}

      {isGracePeriod && (
        <Alert>
          <CheckCircle2 className='h-4 w-4' />
          <AlertTitle>Período de gracia activo</AlertTitle>
          <AlertDescription>
            Tu academia está activa sin una fecha de vencimiento configurada. Contacta al administrador de la plataforma si tienes preguntas sobre tu plan.
          </AlertDescription>
        </Alert>
      )}

      {!isExpired && !isGracePeriod && admin_subscription_days_remaining !== null && admin_subscription_days_remaining !== undefined && admin_subscription_days_remaining <= 30 && (
        <Alert>
          <Clock className='h-4 w-4' />
          <AlertTitle>Suscripción próxima a vencer</AlertTitle>
          <AlertDescription>
            Tu suscripción vence en {admin_subscription_days_remaining} días. Contacta al soporte para renovar tu plan a tiempo.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>¿Necesitas renovar o actualizar?</CardTitle>
          <CardDescription>
            Contacta al equipo de soporte para gestionar tu suscripción.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>
            Para renovar tu plan, extender la vigencia o resolver cualquier problema relacionado con tu suscripción,
            comunícate con el equipo de soporte de la plataforma.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
