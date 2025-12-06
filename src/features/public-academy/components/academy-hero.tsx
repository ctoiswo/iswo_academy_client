import { motion } from 'framer-motion'
import { Users, BookOpen, Heart, Share2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface AcademyHeroProps {
  academy: {
    id: number
    name: string
    slug: string
    description?: string | null
    banner_url?: string | null
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
  }
  isSaved: boolean
  onSave: () => void
  onShare: () => void
}

export function AcademyHero({
  academy,
  isSaved,
  onSave,
  onShare,
}: AcademyHeroProps) {
  const bannerUrl = academy.banner_url || '/images/academy-placeholder.jpg'
  const creatorName =
    academy.creator?.name ||
    `${academy.creator?.first_name || ''} ${academy.creator?.last_name || ''}`.trim() ||
    'Instructor'

  return (
    <section className='relative overflow-hidden'>
      <div className='absolute inset-0'>
        <img
          src={bannerUrl}
          alt={academy.name}
          className='h-full w-full object-cover'
        />
        <div className='absolute inset-0 bg-black/60' />
      </div>

      <div className='relative z-10 container py-20 lg:py-32'>
        <div className='max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {academy.academy_category && (
              <Badge variant='secondary' className='mb-4'>
                {academy.academy_category.name}
              </Badge>
            )}

            <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl'>
              {academy.name}
            </h1>

            {academy.description && (
              <p className='mt-6 max-w-3xl text-lg leading-8 text-gray-200 sm:text-xl'>
                {academy.description}
              </p>
            )}

            <div className='mt-8 flex flex-wrap items-center gap-6 text-white'>
              {creatorName && (
                <div className='flex items-center space-x-2'>
                  <div className='bg-primary flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white'>
                    {creatorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className='font-medium'>Por {creatorName}</p>
                  </div>
                </div>
              )}

              {academy.enrolled_users_count !== undefined && (
                <div className='flex items-center space-x-1'>
                  <Users className='h-5 w-5' />
                  <span>
                    {academy.enrolled_users_count.toLocaleString()} estudiantes
                  </span>
                </div>
              )}

              {academy.courses_count !== undefined && (
                <div className='flex items-center space-x-1'>
                  <BookOpen className='h-5 w-5' />
                  <span>{academy.courses_count} cursos</span>
                </div>
              )}
            </div>

            <div className='mt-8 flex space-x-2'>
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}
