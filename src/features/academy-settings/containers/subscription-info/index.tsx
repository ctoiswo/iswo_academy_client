import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { AlertCircle, CheckCircle2, Check, Clock, CreditCard, Loader2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import {
  ADMIN_SUBSCRIPTION_PLANS,
  getAdminSubscriptionPlan,
  type AdminSubscriptionPlanCode,
} from '@/constants/admin-subscription-plans'
import paymentService from '@/services/payment-service'
import { useAuthStore } from '@/stores/auth-store'
import { formatFullPrice } from '@/lib/formatters'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export function SubscriptionInfo() {
  const { currentAcademy } = useAuthStore()
  const { academySlug } = useParams({ strict: false }) as {
    academySlug?: string
  }
  const [selectedPlanCode, setSelectedPlanCode] =
    useState<AdminSubscriptionPlanCode>(ADMIN_SUBSCRIPTION_PLANS[0].code)

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
  const selectedPlan = getAdminSubscriptionPlan(selectedPlanCode)

  const adminSubscriptionMutation = useMutation({
    mutationFn: () => {
      return paymentService.createAdminSubscription(
        currentAcademy.id,
        selectedPlanCode
      )
    },
    onSuccess: (response) => {
      const checkoutUrl = response.data.checkout_url
      if (!checkoutUrl) {
        toast.error('No se recibió la URL de checkout para continuar el pago.')
        return
      }

      window.location.href = checkoutUrl
    },
    onError: (error: any) => {
      toast.error(
        error?.message || 'No se pudo iniciar el pago de la suscripción anual.'
      )
    },
  })

  const handleStartCheckout = () => {
    adminSubscriptionMutation.mutate()
  }

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

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <ShieldCheck className='h-5 w-5 text-primary' />
            Plan anual de administrador
          </CardTitle>
          <CardDescription>
            Selecciona uno de los dos planes anuales disponibles para activar o renovar tu academia.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid gap-4 lg:grid-cols-2'>
            {ADMIN_SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlanCode === plan.code

              return (
                <button
                  key={plan.code}
                  type='button'
                  onClick={() => setSelectedPlanCode(plan.code)}
                  className={cn(
                    'rounded-xl border p-5 text-left transition-all',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/40 hover:bg-muted/20',
                    plan.code === 'pro' && 'relative'
                  )}
                >
                  {plan.badge && (
                    <span className='bg-primary text-primary-foreground absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-semibold'>
                      {plan.badge}
                    </span>
                  )}

                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='text-lg font-semibold'>{plan.name}</p>
                      <p className='text-muted-foreground mt-1 text-sm'>
                        {plan.description}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'mt-1 flex size-5 items-center justify-center rounded-full border',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-muted-foreground/30'
                      )}
                    >
                      {isSelected && <Check className='h-3.5 w-3.5' />}
                    </div>
                  </div>

                  <div className='mt-5'>
                    <p className='text-3xl font-bold'>
                      {formatFullPrice(plan.price)}
                    </p>
                    <p className='text-muted-foreground mt-1 text-xs'>
                      Pago anual. Vigencia de 12 meses.
                    </p>
                  </div>

                  <ul className='mt-5 space-y-2 text-sm text-muted-foreground'>
                    {plan.features.map((feature) => (
                      <li key={feature} className='flex items-start gap-2'>
                        <Check className='text-primary mt-0.5 h-4 w-4 shrink-0' />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </button>
              )
            })}
          </div>

          <div className='rounded-xl border bg-muted/30 p-5'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Plan seleccionado
                </p>
                <p className='text-2xl font-bold'>
                  {selectedPlan ? selectedPlan.name : 'Selecciona un plan'}
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  El pago se procesa a nombre de ISWO y activa tu academia por 1 ano. Puedes cambiar el plan antes de continuar.
                </p>
              </div>
              <div className='text-left sm:text-right'>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total a pagar
                </p>
                <p className='text-3xl font-bold'>
                  {formatFullPrice(selectedPlan.price)}
                </p>
              </div>
            </div>
          </div>

          <Button
            className='w-full sm:w-auto'
            size='lg'
            onClick={handleStartCheckout}
            disabled={adminSubscriptionMutation.isPending}
          >
            {adminSubscriptionMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Redirigiendo a MercadoPago...
              </>
            ) : (
              <>
                <CreditCard className='mr-2 h-4 w-4' />
                Pagar plan seleccionado
              </>
            )}
          </Button>

          <div className='grid gap-3 text-sm text-muted-foreground sm:grid-cols-3'>
            <div className='rounded-lg border p-4'>
              <p className='font-medium text-foreground'>Activacion inmediata</p>
              <p className='mt-1'>La academia se activa cuando MercadoPago confirma el pago.</p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='font-medium text-foreground'>Vigencia anual</p>
              <p className='mt-1'>El plan elegido extiende la academia por 12 meses.</p>
            </div>
            <div className='rounded-lg border p-4'>
              <p className='font-medium text-foreground'>Pago a ISWO</p>
              <p className='mt-1'>El checkout se procesa con el proveedor de pagos de la plataforma.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isExpired && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>Suscripción vencida</AlertTitle>
          <AlertDescription>
            Tu academia no puede crear ni editar contenido. Activa tu plan anual para volver a operar con normalidad.
          </AlertDescription>
        </Alert>
      )}

      {isGracePeriod && (
        <Alert>
          <CheckCircle2 className='h-4 w-4' />
          <AlertTitle>Período de gracia activo</AlertTitle>
          <AlertDescription>
            Tu academia está activa sin una fecha de vencimiento configurada. Puedes regularizar tu plan anual desde esta misma pantalla.
          </AlertDescription>
        </Alert>
      )}

      {!isExpired && !isGracePeriod && admin_subscription_days_remaining !== null && admin_subscription_days_remaining !== undefined && admin_subscription_days_remaining <= 30 && (
        <Alert>
          <Clock className='h-4 w-4' />
          <AlertTitle>Suscripción próxima a vencer</AlertTitle>
          <AlertDescription>
            Tu suscripción vence en {admin_subscription_days_remaining} días. Puedes renovarla por un ano adicional desde esta pantalla.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
