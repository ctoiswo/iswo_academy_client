import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from '@tanstack/react-router'
import type { AccessCodeRedemptionResponse } from '@/types'
import { Loader2, AlertCircle, ShoppingCart, Ticket } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth-store'
import { formatPrice } from '@/lib/formatters'
import { useCourseBySlug } from '@/hooks/use-featured-content'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AccessCodeRedemption } from '@/components/access-codes/access-code-redemption'
import { Header } from '@/features/home/components/header'

export default function CourseEnrollPage() {
  const { courseSlug } = useParams({ strict: false })
  const navigate = useNavigate()
  const { t } = useTranslation()
  const {
    isAuthenticated,
    refreshAcademies,
    academyData,
    currentAcademy,
    selectAcademy,
  } = useAuthStore()
  const queryClient = useQueryClient()
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false)

  const {
    data: courseData,
    isLoading,
    isError,
    refetch,
  } = useCourseBySlug(courseSlug || '')

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate({
      to: '/sign-in',
      search: { redirect: `/courses/${courseSlug}/enroll` },
    })
    return null
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='bg-background min-h-screen'>
        <Header />
        <div className='container py-16'>
          <div className='flex min-h-[400px] flex-col items-center justify-center'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            <p className='text-muted-foreground mt-4'>Cargando curso...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (isError || !courseData) {
    return (
      <div className='bg-background min-h-screen'>
        <Header />
        <div className='container py-16'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              Error al cargar el curso.{' '}
              <Button variant='outline' size='sm' onClick={() => refetch()}>
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const handlePurchase = () => {
    // TODO: Navigate to payment/checkout page
    navigate({ to: `/courses/${courseSlug}/checkout` })
  }

  const handleRedeemCode = () => {
    setIsRedeemModalOpen(true)
  }

  const handleRedeemSuccess = async () => {
    await refreshAcademies()
    queryClient.invalidateQueries({
      queryKey: ['course', 'public', courseSlug],
    })
  }

  const handleGoToRedeemedAcademyDashboard = async (
    response: AccessCodeRedemptionResponse
  ) => {
    await refreshAcademies()
    queryClient.invalidateQueries({
      queryKey: ['course', 'public', courseSlug],
    })

    const updatedAcademies =
      useAuthStore.getState().academyData?.academies || []
    const targetAcademy = updatedAcademies.find(
      (academy) => academy.slug === response.course.academy.slug
    )

    if (targetAcademy) {
      selectAcademy(targetAcademy.id)
    }

    setIsRedeemModalOpen(false)
    navigate({ to: `/academy/${response.course.academy.slug}/dashboard` })
  }

  const handleSeeLater = () => {
    setIsRedeemModalOpen(false)

    if (currentAcademy?.slug) {
      navigate({ to: `/academy/${currentAcademy.slug}/dashboard` })
      return
    }

    navigate({ to: '/courses' })
  }

  return (
    <div className='bg-background min-h-screen'>
      <Header />

      <div className='container py-16'>
        <div className='mx-auto max-w-4xl'>
          {/* Course Header */}
          <div className='mb-8 text-center'>
            <h1 className='mb-2 text-3xl font-bold tracking-tight'>
              Inscríbete a {courseData.title}
            </h1>
            <p className='text-muted-foreground'>
              Elige cómo deseas acceder a este curso
            </p>
          </div>

          {/* Enrollment Options */}
          <div className='grid gap-6 md:grid-cols-2'>
            {/* Purchase Option */}
            <Card className='border-primary/20 hover:border-primary/40 transition-colors'>
              <CardHeader>
                <div className='mb-4 flex justify-center'>
                  <div className='bg-primary/10 text-primary rounded-full p-4'>
                    <ShoppingCart className='h-8 w-8' />
                  </div>
                </div>
                <CardTitle className='text-center'>Comprar Curso</CardTitle>
                <CardDescription className='text-center'>
                  Acceso inmediato y permanente al curso
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='text-center'>
                  <div className='text-3xl font-bold'>
                    {courseData.pricing_type === 'free' ? (
                      <span className='text-green-600'>Gratis</span>
                    ) : (
                      formatPrice(Number(courseData.price))
                    )}
                  </div>
                  {courseData.pricing_type === 'subscription' && (
                    <p className='text-muted-foreground mt-1 text-sm'>
                      o{' '}
                      {formatPrice(
                        Number(courseData.subscription_price_monthly)
                      )}
                      /mes
                    </p>
                  )}
                </div>

                <ul className='text-muted-foreground space-y-2 text-sm'>
                  <li className='flex items-center'>
                    <span className='mr-2'>✓</span>
                    <span>Acceso inmediato al contenido</span>
                  </li>
                  <li className='flex items-center'>
                    <span className='mr-2'>✓</span>
                    <span>Actualizaciones incluidas</span>
                  </li>
                  {courseData.certificate_enabled && (
                    <li className='flex items-center'>
                      <span className='mr-2'>✓</span>
                      <span>Certificado de finalización</span>
                    </li>
                  )}
                  <li className='flex items-center'>
                    <span className='mr-2'>✓</span>
                    <span>Soporte del instructor</span>
                  </li>
                </ul>

                <Button className='w-full' size='lg' onClick={handlePurchase}>
                  {courseData.pricing_type === 'free'
                    ? 'Inscribirse Gratis'
                    : 'Ir a Pagar'}
                </Button>
              </CardContent>
            </Card>

            {/* Redeem Code Option */}
            <Card className='hover:border-primary/40 transition-colors'>
              <CardHeader>
                <div className='mb-4 flex justify-center'>
                  <div className='rounded-full bg-purple-100 p-4 text-purple-600'>
                    <Ticket className='h-8 w-8' />
                  </div>
                </div>
                <CardTitle className='text-center'>Canjear Código</CardTitle>
                <CardDescription className='text-center'>
                  ¿Tienes un código de acceso?
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='text-center'>
                  <p className='text-muted-foreground text-sm'>
                    Si tienes un código de acceso proporcionado por tu empresa,
                    institución educativa o como regalo, úsalo aquí para acceder
                    al curso sin costo adicional.
                  </p>
                </div>

                <ul className='text-muted-foreground space-y-2 text-sm'>
                  <li className='flex items-center'>
                    <span className='mr-2'>✓</span>
                    <span>Acceso mediante código único</span>
                  </li>
                  <li className='flex items-center'>
                    <span className='mr-2'>✓</span>
                    <span>Sin necesidad de pago</span>
                  </li>
                  <li className='flex items-center'>
                    <span className='mr-2'>✓</span>
                    <span>Mismo contenido completo</span>
                  </li>
                  <li className='flex items-center'>
                    <span className='mr-2'>✓</span>
                    <span>Certificado incluido</span>
                  </li>
                </ul>

                <Button
                  className='w-full'
                  variant='outline'
                  size='lg'
                  onClick={handleRedeemCode}
                >
                  Canjear Código
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Back Button */}
          <div className='mt-8 text-center'>
            <Button
              variant='ghost'
              onClick={() => navigate({ to: `/courses/${courseSlug}` })}
            >
              ← Volver al curso
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
        <DialogContent className='max-h-[85vh] overflow-y-auto sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>{t('accessCode.redeem.title')}</DialogTitle>
            <DialogDescription>
              {t('accessCode.redeem.description')}
            </DialogDescription>
          </DialogHeader>

          <AccessCodeRedemption
            onSuccess={handleRedeemSuccess}
            renderSuccessActions={({ response, reset }) => {
              const redeemedAcademySlug = response.course.academy.slug
              const isDifferentAcademy =
                !!currentAcademy?.slug &&
                currentAcademy.slug !== redeemedAcademySlug
              const hasAcademyInList =
                academyData?.academies?.some(
                  (academy) => academy.slug === redeemedAcademySlug
                ) ?? false

              return (
                <div className='space-y-3'>
                  {isDifferentAcademy && (
                    <Alert>
                      <AlertCircle className='h-4 w-4' />
                      <AlertDescription>
                        Este curso pertenece a la academia{' '}
                        <strong>{response.course.academy.name}</strong> y tu
                        academia actual es{' '}
                        <strong>{currentAcademy?.name}</strong>.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className='grid gap-2 sm:grid-cols-2'>
                    {(isDifferentAcademy || hasAcademyInList) && (
                      <Button
                        onClick={() =>
                          handleGoToRedeemedAcademyDashboard(response)
                        }
                        className='w-full'
                      >
                        Ir al dashboard de {response.course.academy.name}
                      </Button>
                    )}

                    <Button
                      onClick={handleSeeLater}
                      variant='outline'
                      className='w-full'
                    >
                      Ver mas tarde
                    </Button>
                  </div>

                  <Button onClick={reset} variant='ghost' className='w-full'>
                    {t('accessCode.redeem.redeemAnotherButton')}
                  </Button>
                </div>
              )
            }}
          />

          <div className='text-muted-foreground text-center text-sm'>
            <p>
              {t('accessCode.redeem.helpText')}
              <br />
              {t('common.no')}{' '}
              <Button
                variant='link'
                className='h-auto p-0 text-sm'
                onClick={() => setIsRedeemModalOpen(false)}
              >
                {t('accessCode.redeem.browseCourses')}
              </Button>
              .
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
