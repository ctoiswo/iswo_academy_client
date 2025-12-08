import { useParams, useNavigate } from '@tanstack/react-router'
import { Loader2, AlertCircle, ShoppingCart, Ticket } from 'lucide-react'
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
import { Header } from '@/features/home/components/header'

export default function CourseEnrollPage() {
  const { courseSlug } = useParams({ strict: false })
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

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
    // Navigate to redeem code page within the academy context
    if (courseData?.academy?.slug) {
      navigate({
        to: '/academy/$academySlug/redeem-code',
        params: { academySlug: courseData.academy.slug },
      })
    } else {
      // Fallback to generic redeem code page
      navigate({ to: '/redeem-code' })
    }
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
    </div>
  )
}
