import { useState } from 'react'
import type { Course, DifficultyLevel } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Users, Star, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

  const hasPromoVideo =
    course.promotional_video_embedded_url || course.promotional_video_url

  return (
    <>
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
          </div>

          {/* Right Column - Sidebar */}
          <div className='lg:col-span-1'>
            {/* Sidebar content will be rendered here by parent */}
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
