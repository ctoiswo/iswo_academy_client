import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { paymentService } from '@/services/payment-service'
import { Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useAcademy } from '@/hooks/use-academy'
import { useWishlist } from '@/hooks/use-wishlist'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Particles } from '@/components/ui/particles'
import {
  PageHeader,
  PageFooter,
  AcademyHero,
  AcademyInfo,
  CoursesSection,
} from './components'

export function PublicAcademyPage() {
  const { slug } = useParams({ strict: false })
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [isBuyingSubscription, setIsBuyingSubscription] = useState(false)

  // Fetch academy data
  const {
    academy: backendAcademy,
    loading,
    error,
    refetch,
  } = useAcademy(slug || '')

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (!backendAcademy) return

    if (!isAuthenticated) {
      toast.info('Inicia sesión para guardar academias')
      navigate({ to: '/sign-in' })
      return
    }

    const added = toggleWishlist(
      'academy',
      backendAcademy.id,
      backendAcademy.slug,
      backendAcademy.name
    )

    if (added) {
      toast.success(`${backendAcademy.name} guardada en tu lista`)
    } else {
      toast.info(`${backendAcademy.name} removida de tu lista`)
    }
  }

  // Handle share
  const handleShare = async () => {
    if (!backendAcademy) return

    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: backendAcademy.name,
          text: backendAcademy.description || '',
          url: url,
        })
      } catch (_err) {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        toast.success('Enlace copiado al portapapeles')
      } catch (_err) {
        toast.error('No se pudo copiar el enlace')
      }
    }
  }

  const handleBuySubscription = async () => {
    if (!backendAcademy) return

    if (!isAuthenticated) {
      toast.info('Inicia sesión para comprar la suscripción')
      navigate({
        to: '/sign-in',
        search: { redirect: window.location.pathname },
      })
      return
    }

    try {
      setIsBuyingSubscription(true)
      const result = await paymentService.createAcademySubscription(
        backendAcademy.id
      )
      const checkoutUrl = result?.data?.checkout_url

      if (!checkoutUrl) {
        throw new Error('No se recibió URL de checkout para la suscripción')
      }

      window.location.href = checkoutUrl
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar la compra de suscripción'
      toast.error(message)
    } finally {
      setIsBuyingSubscription(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='text-primary mx-auto h-12 w-12 animate-spin' />
          <p className='text-muted-foreground mt-4'>Cargando academia...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !backendAcademy) {
    return (
      <div className='bg-background min-h-screen'>
        <PageHeader />
        <div className='container py-20'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              {error || 'No se encontró la academia'}
              <Button
                variant='outline'
                size='sm'
                onClick={() => refetch()}
                className='ml-4'
              >
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const isSaved = isInWishlist('academy', backendAcademy.id)
  const courses = backendAcademy.courses || []

  return (
    <div className='bg-background relative min-h-screen overflow-hidden'>
      <Particles
        className='pointer-events-none fixed inset-0 z-0'
        quantity={90}
        ease={70}
        size={0.45}
        staticity={48}
      />
      <div className='pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)]' />

      <div className='relative z-10'>
        <PageHeader />

        <AcademyHero
          academy={backendAcademy}
          isSaved={isSaved}
          onSave={handleWishlistToggle}
          onShare={handleShare}
          onBuySubscription={handleBuySubscription}
          isBuyingSubscription={isBuyingSubscription}
        />

        <AcademyInfo academy={backendAcademy} />

        <CoursesSection
          courses={courses}
          academyName={backendAcademy.name}
          academySlug={backendAcademy.slug}
        />

        <PageFooter />
      </div>
    </div>
  )
}
