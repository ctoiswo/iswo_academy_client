import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  Heart,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AcademyHeroProps {
  academy: {
    id: number
    name: string
    slug: string
    description?: string | null
    banner_url?: string | null
    logo_url?: string | null
    enrolled_users_count?: number
    courses_count?: number
    creator?: {
      name?: string
      first_name?: string | null
      last_name?: string | null
    } | null
    academy_category?: {
      name: string
    } | null
    subscription_required?: boolean
    monthly_price?: string
  }
  isSaved: boolean
  onSave: () => void
  onShare: () => void
  onBuySubscription?: () => void
  isBuyingSubscription?: boolean
}

export function AcademyHero({
  academy,
  isSaved,
  onSave,
  onShare,
  onBuySubscription,
  isBuyingSubscription = false,
}: AcademyHeroProps) {
  const bannerUrl = academy.banner_url ?? null
  const logoUrl = academy.logo_url ?? null
  const creatorName =
    academy.creator?.name ||
    `${academy.creator?.first_name || ''} ${academy.creator?.last_name || ''}`.trim() ||
    'Instructor'

  return (
    <section className='relative overflow-hidden'>
      {/* Background banner with vertical gradient fade */}
      {bannerUrl ? (
        <>
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{ backgroundImage: `url(${bannerUrl})` }}
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-background' />
        </>
      ) : (
        <>
          <div className='from-primary/20 via-background to-background absolute inset-0 bg-gradient-to-br' />
          <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_60%)]' />
        </>
      )}
      <div
        className='pointer-events-none absolute inset-0 opacity-[0.04]'
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
        }}
      />

      <div className='relative z-10 mx-auto max-w-7xl px-4 pt-8 pb-14 lg:px-8 lg:pb-16'>
        <Link
          to='/academies'
          className='text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm transition-colors'
        >
          <ArrowLeft className='size-4' />
          Volver a academias
        </Link>

        <div className='grid gap-8 lg:grid-cols-3 lg:gap-12'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='flex flex-col gap-5 lg:col-span-2'
          >
            {/* Logo + category row */}
            <div className='mb-6 flex items-center gap-4'>
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={`${academy.name} logo`}
                  className='h-16 w-16 rounded-xl object-cover shadow-lg ring-2 ring-white/20'
                />
              )}
              {academy.academy_category && (
                <Badge
                  variant='outline'
                  className='border-primary/40 text-primary bg-primary/10'
                >
                  {academy.academy_category.name}
                </Badge>
              )}
              <Badge variant='outline' className='border-border/60 text-muted-foreground'>
                <Sparkles className='mr-1.5 size-3' />
                Academia destacada
              </Badge>
            </div>

            <h1 className='text-foreground text-3xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl'>
              {academy.name}
            </h1>

            {academy.description && (
              <p className='text-muted-foreground mt-2 max-w-3xl text-base leading-relaxed sm:text-lg'>
                {academy.description}
              </p>
            )}

            <div className='mt-4 flex flex-wrap items-center gap-4 text-sm'>
              {creatorName && (
                <div className='flex items-center space-x-2'>
                  <div className='bg-primary/15 text-primary border-primary/20 flex h-10 w-10 items-center justify-center rounded-full border font-semibold'>
                    {creatorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className='text-foreground font-medium'>Por {creatorName}</p>
                  </div>
                </div>
              )}

              {academy.enrolled_users_count !== undefined && (
                <div className='text-muted-foreground flex items-center space-x-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm'>
                  <Users className='h-5 w-5' />
                  <span>
                    {academy.enrolled_users_count.toLocaleString()} estudiantes
                  </span>
                </div>
              )}

              {academy.courses_count !== undefined && (
                <div className='text-muted-foreground flex items-center space-x-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm'>
                  <BookOpen className='h-5 w-5' />
                  <span>{academy.courses_count} cursos</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <div className='border-border/60 bg-card/85 sticky top-24 rounded-2xl border p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md'>
              <div className='mb-3 flex items-center justify-between'>
                <span className='text-muted-foreground text-sm'>Acceso</span>
                <Sparkles className='text-primary size-4' />
              </div>

              {academy.subscription_required ? (
                <>
                  <p className='text-foreground text-xl font-bold'>
                    {academy.monthly_price
                      ? `${academy.monthly_price} / mes`
                      : 'Suscripción requerida'}
                  </p>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    Desbloquea los cursos disponibles de esta academia.
                  </p>

                  {onBuySubscription && (
                    <Button
                      onClick={onBuySubscription}
                      disabled={isBuyingSubscription}
                      className='mt-4 h-11 w-full'
                    >
                      {isBuyingSubscription
                        ? 'Procesando...'
                        : 'Comprar suscripción'}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <p className='text-foreground text-xl font-bold'>Acceso abierto</p>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    Puedes entrar a los cursos sin membresía de academia.
                  </p>
                </>
              )}

              <div className='mt-4 grid grid-cols-2 gap-2'>
                <Button
                  variant={isSaved ? 'default' : 'secondary'}
                  onClick={onSave}
                >
                  <Heart
                    className={`mr-2 h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                  />
                  {isSaved ? 'Guardada' : 'Guardar'}
                </Button>
                <Button variant='secondary' onClick={onShare}>
                  <Share2 className='mr-2 h-4 w-4' />
                  Compartir
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
