import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { enrollmentService } from '@/services/enrollment-service'
import { paymentService } from '@/services/payment-service'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { formatPrice } from '@/lib/formatters'
import { useCourseBySlug } from '@/hooks/use-featured-content'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Header } from '@/features/home/components/header'

export default function CourseCheckoutPage() {
  const { courseSlug } = useParams({ strict: false })
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const paymentStarted = useRef(false)

  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useCourseBySlug(courseSlug || '')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({
        to: '/sign-in',
        search: { redirect: `/courses/${courseSlug}/checkout` },
      })
    }
  }, [isAuthenticated, courseSlug, navigate])

  useEffect(() => {
    if (!courseData || isRedirecting || error) return
    if (paymentStarted.current) return
    paymentStarted.current = true

    const initiateCheckout = async () => {
      setIsRedirecting(true)
      try {
        const isFree = courseData.is_free || Number(courseData.price) === 0

        if (isFree) {
          const academySlug = courseData.academy?.slug
          if (!academySlug) {
            setError('No se pudo determinar la academia del curso.')
            setIsRedirecting(false)
            return
          }
          await enrollmentService.createEnrollment(academySlug, courseSlug!)
          navigate({
            to: '/academy/$academySlug/courses/$courseSlug',
            params: { academySlug, courseSlug: courseSlug! },
          })
          return
        }

        const result = await paymentService.createCoursePurchase(courseData.id)
        const checkout = result.data?.checkout_url

        if (!checkout) {
          setError('No se pudo obtener el enlace de pago. Intenta de nuevo.')
          setIsRedirecting(false)
          return
        }

        setCheckoutUrl(checkout)
        window.location.href = checkout
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error al procesar el pago.'
        setError(message)
        setIsRedirecting(false)
      }
    }

    initiateCheckout()
  }, [courseData]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) return null

  return (
    <div className='bg-background min-h-screen'>
      <Header />

      <div className='container py-16'>
        <div className='mx-auto max-w-lg'>
          <Link
            to='/courses/$courseSlug'
            params={{ courseSlug: courseSlug || '' }}
            className='text-muted-foreground hover:text-foreground mb-8 flex items-center gap-2 text-sm'
          >
            <ArrowLeft className='h-4 w-4' />
            Volver al curso
          </Link>

          {/* Course summary */}
          {courseData && (
            <div className='mb-6'>
              <h1 className='text-xl font-bold'>{courseData.title}</h1>
              <p className='text-muted-foreground mt-1 text-sm'>
                Pago único · Acceso de por vida
              </p>
              <p className='text-primary mt-2 text-2xl font-bold'>
                {formatPrice(Number(courseData.price))}
              </p>
            </div>
          )}

          {/* Loading state */}
          {(isCourseLoading || isRedirecting) && !error && (
            <div className='flex flex-col items-center justify-center gap-4 py-16'>
              <Loader2 className='text-primary h-8 w-8 animate-spin' />
              <p className='text-muted-foreground text-sm'>
                {isCourseLoading
                  ? 'Cargando información del curso...'
                  : courseData?.is_free || Number(courseData?.price) === 0
                    ? 'Inscribiendo al curso...'
                    : 'Redirigiendo a MercadoPago...'}
              </p>
            </div>
          )}

          {/* Error state */}
          {(isCourseError || error) && (
            <div className='space-y-4'>
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  {error ?? 'No se pudo cargar el curso.'}
                </AlertDescription>
              </Alert>
              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setError(null)
                    paymentStarted.current = false
                    setIsRedirecting(false)
                  }}
                >
                  Reintentar
                </Button>
                <Button
                  variant='ghost'
                  onClick={() =>
                    navigate({
                      to: '/courses/$courseSlug',
                      params: { courseSlug: courseSlug || '' },
                    })
                  }
                >
                  Volver al curso
                </Button>
              </div>
              {checkoutUrl && (
                <Button
                  className='w-full'
                  onClick={() =>
                    window.open(checkoutUrl, '_blank', 'noopener,noreferrer')
                  }
                >
                  Abrir checkout en nueva pestaña
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
