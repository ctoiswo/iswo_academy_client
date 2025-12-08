import { useState } from 'react'
import type { Course, DifficultyLevel } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Users, Star, Play, CheckCircle2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface CourseHeroProps {
  course: Course & {
    instructor: {
      name: string
      avatar: string
    }
    rating: number
    total_ratings: number
    thumbnail_url: string
    tags: string[]
    promotional_video_url?: string
    promotional_video_embedded_url?: string
    promotional_image_url?: string
    sections?: Array<{
      id: number
      title: string
      lessons: number
      duration: number
    }>
  }
  getDifficultyColor: (level: DifficultyLevel) => string
  formatDifficulty: (level: DifficultyLevel) => string
}

export function CourseHero({
  course,
  getDifficultyColor,
  formatDifficulty,
}: CourseHeroProps) {
  const [showVideoModal, setShowVideoModal] = useState(false)

  // Use promotional image if available, otherwise use thumbnail
  const heroImage = course.promotional_image_url || course.thumbnail_url
  const hasPromoVideo =
    course.promotional_video_embedded_url || course.promotional_video_url

  return (
    <div className='container pb-8'>
      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='space-y-8 lg:col-span-2'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className='mb-4 flex flex-wrap items-center gap-3'>
              <Badge className={getDifficultyColor(course.difficulty_level)}>
                {formatDifficulty(course.difficulty_level)}
              </Badge>
              <Badge variant='outline'>{course.academy?.name}</Badge>
              {course.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant='secondary'>
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className='text-foreground mb-4 text-3xl font-bold lg:text-4xl'>
              {course.title}
            </h1>

            <p className='text-muted-foreground mb-6 text-lg leading-relaxed'>
              {course.description}
            </p>

            <div className='flex flex-wrap items-center gap-6 text-sm'>
              <div className='flex items-center gap-2'>
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className='h-8 w-8 rounded-full'
                />
                <span>
                  Por{' '}
                  <span className='font-medium'>{course.instructor.name}</span>
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Star className='h-4 w-4 fill-current text-yellow-500' />
                <span className='font-medium'>{course.rating}</span>
                <span className='text-muted-foreground'>
                  ({course.total_ratings})
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Users className='text-muted-foreground h-4 w-4' />
                <span>
                  {course.enrollment_count?.toLocaleString()} estudiantes
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='text-muted-foreground h-4 w-4' />
                <span>{Math.round(course.duration_minutes / 60)} horas</span>
              </div>
            </div>
          </motion.div>

          {/* Course Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='relative overflow-hidden rounded-xl'
          >
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className='h-64 w-full object-cover lg:h-80'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
              <Button
                size='lg'
                className='bg-white/90 text-black hover:bg-white'
    <>
      <div className='from-primary/5 via-background to-background relative bg-gradient-to-br'>
        <div className='container pt-8 pb-12'>
          <div className='grid gap-8 lg:grid-cols-2 lg:gap-12'>
            {/* Left Column - Course Info */}
            <div className='flex flex-col justify-center space-y-6'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badges */}
                <div className='mb-4 flex flex-wrap items-center gap-2'>
                  <Badge
                    className={getDifficultyColor(course.difficulty_level)}
                  >
                    {formatDifficulty(course.difficulty_level)}
                  </Badge>
                  <Badge variant='outline' className='font-medium'>
                    {course.academy?.name}
                  </Badge>
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant='secondary'>
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className='text-foreground mb-4 text-3xl leading-tight font-bold lg:text-5xl'>
                  {course.title}
                </h1>

                {/* Description */}
                <p className='text-muted-foreground text-base leading-relaxed lg:text-lg'>
                  {course.description}
                </p>

                {/* Stats */}
                <div className='flex flex-wrap items-center gap-4 pt-2 text-sm lg:gap-6 lg:text-base'>
                  <div className='flex items-center gap-2'>
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className='border-primary/20 h-10 w-10 rounded-full border-2'
                    />
                    <div className='flex flex-col'>
                      <span className='text-muted-foreground text-xs'>
                        Instructor
                      </span>
                      <span className='font-semibold'>
                        {course.instructor.name}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Star className='h-5 w-5 fill-yellow-500 text-yellow-500' />
                    <span className='font-bold'>{course.rating}</span>
                    <span className='text-muted-foreground'>
                      ({course.total_ratings.toLocaleString()})
                    </span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Users className='text-primary h-5 w-5' />
                    <span className='font-semibold'>
                      {course.enrollment_count?.toLocaleString()}
                    </span>
                    <span className='text-muted-foreground'>estudiantes</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <Clock className='text-primary h-5 w-5' />
                    <span className='font-semibold'>
                      {Math.round(course.duration_minutes / 60)}h
                    </span>
                    <span className='text-muted-foreground'>de contenido</span>
                  </div>
                </div>

                {/* Quick Benefits */}
                {course.certificate_enabled && (
                  <div className='flex items-center gap-2 rounded-lg bg-green-50 p-3 dark:bg-green-950/20'>
                    <CheckCircle2 className='h-5 w-5 text-green-600' />
                    <span className='text-sm font-medium text-green-900 dark:text-green-100'>
                      Obtén certificado al completar el curso
                    </span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Media Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='relative'
            >
              <div className='relative overflow-hidden rounded-2xl shadow-2xl'>
                <img
                  src={heroImage}
                  alt={course.title}
                  className='aspect-video h-full w-full object-cover'
                />
                {hasPromoVideo && (
                  <div className='absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/20 to-transparent'>
                    <Button
                      size='lg'
                      onClick={() => setShowVideoModal(true)}
                      className='h-16 w-16 rounded-full bg-white p-0 text-black shadow-xl transition-transform hover:scale-110 hover:bg-white lg:h-20 lg:w-20'
                    >
                      <Play className='ml-1 h-8 w-8 fill-current lg:h-10 lg:w-10' />
                    </Button>
                  </div>
                )}
                {hasPromoVideo && (
                  <div className='absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm'>
                    <span className='text-sm font-medium text-white'>
                      🎬 Vista previa del curso
                    </span>
                  </div>
                )}
              </div>

              {/* Floating Stats Card (Desktop only) */}
              <div className='bg-card absolute right-6 -bottom-6 left-6 hidden rounded-xl border p-4 shadow-lg lg:block'>
                <div className='grid grid-cols-3 gap-4 text-center'>
                  <div>
                    <div className='text-primary text-2xl font-bold'>
                      {course.sections?.length || 0}
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      Secciones
                    </div>
                  </div>
                  <div>
                    <div className='text-primary text-2xl font-bold'>
                      {course.sections?.reduce(
                        (sum: number, s: any) => sum + s.lessons,
                        0
                      ) || 0}
                    </div>
                    <div className='text-muted-foreground text-xs'>
                      Lecciones
                    </div>
                  </div>
                  <div>
                    <div className='text-primary text-2xl font-bold'>
                      {course.is_free
                        ? 'Gratis'
                        : `$${(parseFloat(course.price.toString()) / 1000).toFixed(0)}k`}
                    </div>
                    <div className='text-muted-foreground text-xs'>Precio</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Modal with Animation */}
      <AnimatePresence>
        {showVideoModal && hasPromoVideo && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 z-50 bg-black/90 backdrop-blur-sm'
              onClick={() => setShowVideoModal(false)}
            />

            {/* Modal Content */}
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 300,
                  duration: 0.4,
                }}
                className='relative w-full max-w-5xl'
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowVideoModal(false)}
                  className='absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20'
                  aria-label='Cerrar video'
                >
                  <X className='h-6 w-6' />
                </button>

                {/* Video Container */}
                <div className='relative aspect-video overflow-hidden rounded-xl bg-black shadow-2xl'>
                  {course.promotional_video_embedded_url ? (
                    <iframe
                      src={`${course.promotional_video_embedded_url}?autoplay=1`}
                      className='h-full w-full'
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      title={`${course.title} - Vista previa`}
                    />
                  ) : (
                    <video
                      src={course.promotional_video_url}
                      className='h-full w-full'
                      controls
                      autoPlay
                    >
                      Tu navegador no soporta el tag de video.
                    </video>
                  )}
                </div>

                {/* Video Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className='mt-4 text-center text-white'
                >
                  <h3 className='text-lg font-semibold'>{course.title}</h3>
                  <p className='text-sm text-white/70'>
                    Vista previa del curso
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
