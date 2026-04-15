import { useMemo } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  CheckCircle2,
  XCircle,
  Clock3,
  Home,
  BookOpen,
  RefreshCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/features/home/components/header'

type PaymentCallbackStatus = 'success' | 'failure' | 'pending'

interface PaymentCallbackPageProps {
  status: PaymentCallbackStatus
}

const statusUi = {
  success: {
    title: 'Pago aprobado',
    message: 'Tu pago fue procesado correctamente.',
    icon: CheckCircle2,
    iconClass: 'text-green-600',
  },
  failure: {
    title: 'Pago rechazado',
    message: 'El pago no se pudo completar. Puedes intentarlo de nuevo.',
    icon: XCircle,
    iconClass: 'text-red-600',
  },
  pending: {
    title: 'Pago pendiente',
    message: 'Estamos procesando tu pago. Te avisaremos cuando se confirme.',
    icon: Clock3,
    iconClass: 'text-amber-600',
  },
} as const

export default function PaymentCallbackPage({
  status,
}: PaymentCallbackPageProps) {
  const { paymentId } = useParams({ strict: false })

  const details = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return {
      collectionStatus:
        params.get('collection_status') || params.get('status') || '-',
      paymentType: params.get('payment_type') || '-',
      preferenceId: params.get('preference_id') || '-',
      collectionId:
        params.get('collection_id') || params.get('payment_id') || '-',
    }
  }, [])

  const ui = statusUi[status]
  const Icon = ui.icon

  return (
    <div className='bg-background min-h-screen'>
      <Header />

      <div className='container py-12'>
        <div className='mx-auto max-w-2xl'>
          <Card>
            <CardHeader className='text-center'>
              <div className='mb-3 flex justify-center'>
                <Icon className={`h-12 w-12 ${ui.iconClass}`} />
              </div>
              <CardTitle className='text-2xl'>{ui.title}</CardTitle>
              <p className='text-muted-foreground text-sm'>{ui.message}</p>
            </CardHeader>

            <CardContent className='space-y-6'>
              <div className='bg-muted/50 rounded-md border p-4 text-sm'>
                <div className='mb-2 font-medium'>
                  Detalle de la transacción
                </div>
                <div className='grid gap-2'>
                  <div className='flex justify-between gap-4'>
                    <span className='text-muted-foreground'>
                      Payment interno
                    </span>
                    <span className='font-medium'>#{paymentId || '-'}</span>
                  </div>
                  <div className='flex justify-between gap-4'>
                    <span className='text-muted-foreground'>Estado MP</span>
                    <span className='font-medium'>
                      {details.collectionStatus}
                    </span>
                  </div>
                  <div className='flex justify-between gap-4'>
                    <span className='text-muted-foreground'>Tipo</span>
                    <span className='font-medium'>{details.paymentType}</span>
                  </div>
                  <div className='flex justify-between gap-4'>
                    <span className='text-muted-foreground'>ID MP</span>
                    <span className='font-medium'>{details.collectionId}</span>
                  </div>
                  <div className='flex justify-between gap-4'>
                    <span className='text-muted-foreground'>Preference</span>
                    <span className='truncate font-medium'>
                      {details.preferenceId}
                    </span>
                  </div>
                </div>
              </div>

              <div className='flex flex-wrap gap-3'>
                <Link to='/my-courses'>
                  <Button>
                    <BookOpen className='mr-2 h-4 w-4' />
                    Ir a mis cursos
                  </Button>
                </Link>

                <Link to='/'>
                  <Button variant='outline'>
                    <Home className='mr-2 h-4 w-4' />
                    Ir al inicio
                  </Button>
                </Link>

                {status === 'failure' && (
                  <Button
                    variant='secondary'
                    onClick={() => window.history.back()}
                  >
                    <RefreshCcw className='mr-2 h-4 w-4' />
                    Reintentar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
