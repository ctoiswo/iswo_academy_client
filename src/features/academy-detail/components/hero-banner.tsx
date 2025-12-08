import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Clock,
  Share2,
  Heart,
  ShoppingCart,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface HeroBannerProps {
  academy: any
  router: any
}

export function HeroBanner({ academy, router }: HeroBannerProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={sectionVariants}
      className='relative h-96 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
    >
      {/* Background Pattern */}
      <div className='absolute inset-0 bg-black/20' />
      <div className='bg-grid-white/10 absolute inset-0' />

      {/* Banner Image */}
      {academy.banner_url && (
        <img
          src={academy.banner_url}
          alt={`${academy.name} banner`}
          className='absolute inset-0 h-full w-full object-cover'
        />
      )}

      {/* Overlay Content */}
      <div className='relative container mx-auto flex h-full items-end px-4 pb-8'>
        <div className='flex w-full items-end gap-6'>
          {/* Academy Logo */}
          <motion.div variants={sectionVariants} className='flex-shrink-0'>
            <div className='bg-background flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/20 shadow-xl backdrop-blur-sm'>
              {academy.logo_url ? (
                <img
                  src={academy.logo_url}
                  alt={`${academy.name} logo`}
                  className='h-full w-full object-cover'
                />
              ) : (
                <BookOpen className='text-muted-foreground h-16 w-16' />
              )}
            </div>
          </motion.div>

          {/* Academy Info */}
          <motion.div variants={sectionVariants} className='flex-1 text-white'>
            <div className='mb-2 flex items-center gap-2'>
              <Badge className='border-white/30 bg-white/20 text-white backdrop-blur-sm'>
                {academy.category.name}
              </Badge>
              <div className='flex items-center gap-1'>
                <Star className='h-4 w-4 fill-current text-yellow-400' />
                <span className='font-semibold'>{academy.rating}</span>
                <span className='text-white/80'>
                  ({academy.reviews_count} reseñas)
                </span>
              </div>
            </div>

            <h1 className='mb-3 text-4xl font-bold lg:text-5xl'>
              {academy.name}
            </h1>

            <p className='mb-4 max-w-2xl text-lg text-white/90'>
              {academy.description}
            </p>

            <div className='flex items-center gap-6 text-sm'>
              <div className='flex items-center gap-2'>
                <Users className='h-4 w-4' />
                <span>
                  {(academy.enrolled_users_count || 0).toLocaleString()}{' '}
                  estudiantes
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <BookOpen className='h-4 w-4' />
                <span>{academy.courses_count || 0} cursos</span>
              </div>
              {academy.total_duration_hours && (
                <div className='flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  <span>{academy.total_duration_hours}h de contenido</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={sectionVariants}
            className='flex flex-col gap-3'
          >
            <Button size='lg' className='bg-white text-black hover:bg-white/90'>
              <ShoppingCart className='mr-2 h-4 w-4' />
              Suscribirse ${academy.monthly_price || 0}/mes
            </Button>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                className='border-white/30 bg-white/10 text-white hover:bg-white/20'
              >
                <Heart className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='border-white/30 bg-white/10 text-white hover:bg-white/20'
              >
                <Share2 className='h-4 w-4' />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Back Button */}
      <div className='absolute top-6 left-6'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => router.history.back()}
          className='border-white/30 bg-white/10 text-white hover:bg-white/20'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Volver
        </Button>
      </div>
    </motion.div>
  )
}
