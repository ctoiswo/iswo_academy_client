import { useMemo, useState } from 'react'
import { useParams, useNavigate, useSearch } from '@tanstack/react-router'
import {
  ArrowLeft,
  AlertCircle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Lock,
  Play,
  Share2,
  Star,
  Users,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { formatPrice } from '@/lib/formatters'
import { useCourseBySlug } from '@/hooks/use-featured-content'
import { useWishlist } from '@/hooks/use-wishlist'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/features/home/components/header'

export function PublicCoursePage() {
  const { courseSlug } = useParams({ strict: false })
  const search = useSearch({ strict: false }) as {
    fromAcademySlug?: string
  }
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [showVideoModal, setShowVideoModal] = useState(false)

  const {
    data: courseData,
    isLoading,
    isError,
    refetch,
  } = useCourseBySlug(courseSlug || '')

  const sections = courseData?.sections_summary ?? []
  const objectives =
    courseData?.course_objectives?.map((item) => item.formatted_title) ?? []

  const prerequisites = useMemo(() => {
    if (!courseData?.prerequisites) return []
    return String(courseData.prerequisites)
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }, [courseData?.prerequisites])

  const totalLessons =
    courseData?.total_lessons ??
    sections.reduce((acc, section) => acc + section.lessons_count, 0)

  const totalDurationMinutes =
    courseData?.duration_minutes ??
    sections.reduce((acc, section) => acc + section.duration_minutes, 0)

  const durationLabel =
    totalDurationMinutes > 0
      ? `${Math.max(1, Math.round(totalDurationMinutes / 60))}h`
      : null

  const hasPromoVideo =
    Boolean(courseData?.promotional_video_embedded_url) ||
    Boolean(courseData?.promotional_video_url)

  const instructorInitials = courseData?.creator?.name
    ? courseData.creator.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '?'

  if (isLoading) {
    return (
      <div className='bg-background min-h-screen'>
        <Header />
        <div className='mx-auto max-w-7xl px-4 py-16 lg:px-8'>
          <div className='flex min-h-[420px] flex-col items-center justify-center gap-4'>
            <div className='border-primary/30 border-t-primary size-10 animate-spin rounded-full border-2' />
            <p className='text-muted-foreground text-sm'>Cargando curso...</p>
          </div>
        </div>
      </div>
    )
  }

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

  const isSaved = isInWishlist('course', courseData.id)
  const isEnrolled = courseData.enrolled === true

  const handleSaveClick = () => {
    if (!isAuthenticated) {
      toast.info('Inicia sesión para guardar cursos')
      navigate({ to: '/sign-in' })
      return
    }

    const added = toggleWishlist(
      'course',
      courseData.id,
      courseData.slug,
      courseData.title
    )
    if (added) {
      toast.success(`${courseData.title} guardado en tu lista`)
    } else {
      toast.info(`${courseData.title} removido de tu lista`)
    }
  }

  const handleShareClick = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: courseData.title,
          text: courseData.description,
          url: url,
        })
      } catch (_err) {
        // sharing cancelled or not supported
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

  const handleEnrollClick = () => {
    navigate({ to: `/courses/${courseSlug}/enroll` })
  }

  const handleContinueCourseClick = () => {
    const academySlug = courseData.academy?.slug
    if (!academySlug || !courseSlug) {
      navigate({ to: '/my-courses' })
      return
    }

    navigate({
      to: '/academy/$academySlug/courses/$courseSlug/content',
      params: { academySlug, courseSlug },
    })
  }

  const handleBackClick = () => {
    const academySlugFromSearch = search.fromAcademySlug
    if (academySlugFromSearch) {
      navigate({
        to: '/academies/$slug',
        params: { slug: academySlugFromSearch },
      })
      return
    }

    if (typeof window !== 'undefined' && document.referrer) {
      try {
        const ref = new URL(document.referrer)
        if (ref.origin === window.location.origin) {
          const academyMatch = ref.pathname.match(/^\/academies\/([^/]+)\/?$/)
          if (academyMatch?.[1]) {
            navigate({
              to: '/academies/$slug',
              params: { slug: academyMatch[1] },
            })
            return
          }

          if (ref.pathname.startsWith('/courses')) {
            navigate({ to: '/courses' })
            return
          }
        }
      } catch (_error) {
        // Ignore malformed referrer and fallback below.
      }
    }

    navigate({ to: '/courses' })
  }

  return (
    <div className='bg-background min-h-screen'>
      <Header />

      <div className='relative overflow-hidden'>
        {courseData.promotional_image_url ? (
          <>
            <div
              className='absolute inset-0 bg-cover bg-center'
              style={{
                backgroundImage: `url(${courseData.promotional_image_url})`,
              }}
            />
            <div className='to-background absolute inset-0 bg-gradient-to-b from-black/60 via-black/40' />
          </>
        ) : (
          <>
            <div className='from-primary/20 via-background to-background absolute inset-0 bg-gradient-to-br' />
            <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]' />
          </>
        )}
        <div
          className='pointer-events-none absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className='relative mx-auto max-w-7xl px-4 pt-8 pb-12 lg:px-8 lg:pb-16'>
          <button
            onClick={handleBackClick}
            className='text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors'
          >
            <ArrowLeft className='size-4' />
            Volver
          </button>

          <div className='grid gap-8 lg:grid-cols-3 lg:gap-12'>
            <div className='flex flex-col gap-5 lg:col-span-2'>
              <div className='flex flex-wrap items-center gap-2'>
                {courseData.category && (
                  <Badge
                    variant='outline'
                    className='border-primary/40 text-primary bg-primary/10'
                  >
                    {courseData.category}
                  </Badge>
                )}
                {(courseData.tags ?? []).slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant='outline'
                    className='border-border/60 text-muted-foreground'
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className='text-foreground text-3xl font-bold tracking-tight text-balance md:text-4xl lg:text-5xl'>
                {courseData.title}
              </h1>

              {courseData.description && (
                <p className='text-muted-foreground line-clamp-3 max-w-2xl text-base leading-relaxed md:text-lg'>
                  {courseData.description}
                </p>
              )}

              <div className='flex flex-wrap items-center gap-4 text-sm'>
                {courseData.average_rating != null && (
                  <div className='flex items-center gap-2'>
                    <Star className='size-4 fill-amber-400 text-amber-400' />
                    <span className='font-semibold text-amber-400'>
                      {Number(courseData.average_rating).toFixed(1)}
                    </span>
                  </div>
                )}
                {courseData.enrollment_count != null && (
                  <span className='text-muted-foreground flex items-center gap-1.5'>
                    <Users className='size-4' />
                    {new Intl.NumberFormat('es').format(
                      courseData.enrollment_count
                    )}{' '}
                    estudiantes
                  </span>
                )}
              </div>

              {courseData.creator?.name && (
                <div className='flex items-center gap-3'>
                  <Avatar className='border-primary/20 size-10 border-2'>
                    <AvatarImage src='' />
                    <AvatarFallback className='bg-primary/10 text-primary text-sm font-medium'>
                      {instructorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-foreground text-sm font-medium'>
                      Creado por {courseData.creator.name}
                    </span>
                    {courseData.academy?.name && (
                      <span className='text-muted-foreground text-xs'>
                        {courseData.academy.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className='text-muted-foreground flex flex-wrap items-center gap-4 text-xs'>
                {durationLabel && (
                  <span className='flex items-center gap-1.5'>
                    <Clock className='size-3.5' />
                    Duración estimada: {durationLabel}
                  </span>
                )}
                {courseData.difficulty_level && (
                  <span className='flex items-center gap-1.5'>
                    <BarChart3 className='size-3.5' />
                    Nivel: {courseData.difficulty_level}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className='border-border/60 bg-card sticky top-24 overflow-hidden rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.2)]'>
                {courseData.promotional_image_url ? (
                  <div
                    className='relative aspect-video bg-cover bg-center'
                    style={{
                      backgroundImage: `url(${courseData.promotional_image_url})`,
                    }}
                  >
                    <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                      {hasPromoVideo && (
                        <button
                          onClick={() => setShowVideoModal(true)}
                          className='bg-primary/90 text-primary-foreground flex size-16 items-center justify-center rounded-full shadow-[0_0_32px_rgba(99,102,241,0.4)] transition-transform hover:scale-105'
                        >
                          <Play className='ml-1 size-7' />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='from-primary/15 to-primary/5 flex aspect-video items-center justify-center bg-gradient-to-br'>
                    <BookOpen className='text-primary/50 size-10' />
                  </div>
                )}

                <div className='space-y-4 p-5'>
                  <div className='flex items-baseline justify-between'>
                    <span className='text-muted-foreground text-sm'>
                      Precio
                    </span>
                    <span className='text-foreground text-2xl font-bold'>
                      {formatPrice(Number(courseData.price))}
                    </span>
                  </div>

                  <Button
                    onClick={
                      isEnrolled ? handleContinueCourseClick : handleEnrollClick
                    }
                    className={`h-11 w-full ${isEnrolled ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
                  >
                    {isEnrolled
                      ? 'Continuar curso'
                      : 'Ver opciones de inscripción'}
                  </Button>

                  <div className='grid grid-cols-2 gap-2'>
                    <Button variant='outline' onClick={handleSaveClick}>
                      {isSaved ? 'Guardado' : 'Guardar'}
                    </Button>
                    <Button variant='outline' onClick={handleShareClick}>
                      <Share2 className='mr-2 size-4' />
                      Compartir
                    </Button>
                  </div>

                  {!isAuthenticated && (
                    <p className='text-muted-foreground text-center text-xs'>
                      Inicia sesión para acceder al contenido completo del
                      curso.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 pb-16 lg:px-8'>
        <div className='grid gap-8 lg:grid-cols-3 lg:gap-12'>
          <div className='space-y-8 lg:col-span-2'>
            {objectives.length > 0 && (
              <section className='border-border/60 bg-card rounded-2xl border p-6'>
                <h2 className='mb-4 text-xl font-semibold'>
                  Lo que aprenderás
                </h2>
                <div className='grid gap-3 md:grid-cols-2'>
                  {objectives.map((objective) => (
                    <div
                      key={objective}
                      className='flex items-start gap-2 text-sm'
                    >
                      <CheckCircle2 className='text-primary mt-0.5 size-4 shrink-0' />
                      <span>{objective}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {prerequisites.length > 0 && (
              <section className='border-border/60 bg-card rounded-2xl border p-6'>
                <h2 className='mb-4 text-xl font-semibold'>Requisitos</h2>
                <ul className='text-muted-foreground space-y-2 text-sm'>
                  {prerequisites.map((requirement) => (
                    <li key={requirement} className='flex items-start gap-2'>
                      <span className='text-primary mt-1 inline-block size-1.5 rounded-full bg-current' />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className='border-border/60 bg-card rounded-2xl border p-6'>
              <h2 className='mb-1 text-xl font-semibold'>
                Contenido del curso
              </h2>
              <p className='text-muted-foreground mb-4 text-sm'>
                {sections.length} secciones · {totalLessons} clases
              </p>

              <Accordion type='single' collapsible className='w-full'>
                {sections.map((section, index) => (
                  <AccordionItem
                    key={section.id}
                    value={`section-${section.id}`}
                  >
                    <AccordionTrigger>
                      <div className='mr-3 flex w-full items-center justify-between text-left'>
                        <div>
                          <p className='text-sm font-medium'>
                            {index + 1}. {section.title}
                          </p>
                          <p className='text-muted-foreground text-xs'>
                            {section.lessons_count} clases ·{' '}
                            {Math.max(
                              1,
                              Math.round(section.duration_minutes / 60)
                            )}
                            h
                          </p>
                        </div>
                        <Lock className='text-muted-foreground size-4 shrink-0' />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className='text-muted-foreground text-sm'>
                        {section.description ||
                          'Inicia sesión y completa tu inscripción para desbloquear esta sección.'}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          <aside className='space-y-4'>
            <div className='border-border/60 bg-card rounded-2xl border p-5'>
              <h3 className='mb-3 text-sm font-semibold'>Este curso incluye</h3>
              <div className='text-muted-foreground space-y-2 text-sm'>
                <p className='flex items-center gap-2'>
                  <BookOpen className='size-4' />
                  {totalLessons} clases
                </p>
                {durationLabel && (
                  <p className='flex items-center gap-2'>
                    <Clock className='size-4' />
                    {durationLabel} de contenido
                  </p>
                )}
                {courseData.certificate_enabled && (
                  <p className='flex items-center gap-2'>
                    <Award className='size-4' />
                    Certificado al finalizar
                  </p>
                )}
                <p className='flex items-center gap-2'>
                  <Lock className='size-4' />
                  Acceso completo tras inscripción
                </p>
              </div>
              <Separator className='my-4' />
              <Button
                className={`w-full ${isAuthenticated && isEnrolled ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
                variant={isAuthenticated && !isEnrolled ? 'outline' : 'default'}
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate({
                      to: '/sign-in',
                      search: { redirect: `/courses/${courseSlug}` },
                    })
                    return
                  }

                  if (isEnrolled) {
                    handleContinueCourseClick()
                    return
                  }

                  handleEnrollClick()
                }}
              >
                {isAuthenticated
                  ? isEnrolled
                    ? 'Continuar curso'
                    : 'Continuar con inscripción'
                  : 'Inicia sesión'}
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {showVideoModal && hasPromoVideo && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4'>
          <div className='bg-card border-border relative w-full max-w-4xl rounded-2xl border'>
            <button
              onClick={() => setShowVideoModal(false)}
              className='text-muted-foreground hover:text-foreground absolute top-3 right-3 z-10 rounded-full p-2 transition-colors'
              aria-label='Cerrar'
            >
              <X className='size-5' />
            </button>

            <div className='aspect-video w-full overflow-hidden rounded-2xl'>
              {courseData.promotional_video_embedded_url ? (
                <iframe
                  src={courseData.promotional_video_embedded_url}
                  title='Video promocional'
                  className='h-full w-full'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
              ) : (
                <video
                  src={courseData.promotional_video_url || undefined}
                  controls
                  className='h-full w-full'
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
