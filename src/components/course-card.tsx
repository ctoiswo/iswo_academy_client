import type { Course } from '@/types'
import { motion } from 'framer-motion'
import { Clock, Users, BookOpen, Play, Lock, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface CourseCardProps {
  course: Course
  index?: number
  academySlug: string
}

export function CourseCard({
  course,
  index = 0,
}: Omit<CourseCardProps, 'academySlug'>) {
  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1,
      },
    },
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Principiante'
      case 'intermediate':
        return 'Intermedio'
      case 'advanced':
        return 'Avanzado'
      default:
        return 'Todos los niveles'
    }
  }

  const formatPrice = (price: number | null) => {
    if (price === null || price === 0) return 'Gratis'
    return `$${price.toLocaleString()}`
  }

  return (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      animate='visible'
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className='group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg'>
        <CardContent className='p-0'>
          <div className='flex flex-col lg:flex-row'>
            {/* Course Image */}
            <div className='relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 lg:h-40 lg:w-80'>
              {course.thumbnail_url ? (
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
              ) : (
                <BookOpen className='text-muted-foreground h-16 w-16' />
              )}

              {/* Play Button Overlay */}
              <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                <div className='rounded-full bg-white/90 p-3'>
                  <Play className='h-6 w-6 text-black' />
                </div>
              </div>

              {/* Course Level Badge */}
              <div className='absolute top-3 right-3'>
                <Badge className={getLevelColor(course.difficulty_level)}>
                  {getLevelText(course.difficulty_level)}
                </Badge>
              </div>

              {/* Published Status */}
              {course.status !== 'published' && (
                <div className='absolute top-3 left-3'>
                  <Badge variant='outline' className='bg-white/90'>
                    <Lock className='mr-1 h-3 w-3' />
                    Próximamente
                  </Badge>
                </div>
              )}
            </div>

            {/* Course Content */}
            <div className='flex-1 p-6'>
              <div className='mb-3 flex items-start justify-between'>
                <div className='flex-1'>
                  <h3 className='text-foreground mb-2 line-clamp-2 text-xl font-bold transition-colors group-hover:text-blue-600'>
                    {course.title}
                  </h3>

                  <p className='text-muted-foreground mb-3 line-clamp-2 text-sm'>
                    {course.description}
                  </p>

                  <div className='mb-3 flex items-center gap-2'>
                    <Award className='h-4 w-4 text-orange-500' />
                    <span className='text-foreground text-sm font-medium'>
                      {course.creator?.name}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className='ml-4 text-right'>
                  {course.sale_price ? (
                    <div>
                      <div className='text-lg font-bold text-green-600'>
                        {formatPrice(course.sale_price)}
                      </div>
                      <div className='text-muted-foreground text-sm line-through'>
                        {formatPrice(course.price)}
                      </div>
                    </div>
                  ) : (
                    <div className='text-foreground text-lg font-bold'>
                      {formatPrice(course.price)}
                    </div>
                  )}
                </div>
              </div>

              {/* Course Stats */}
              <div className='text-muted-foreground mb-4 flex items-center gap-6 text-sm'>
                {course.duration_minutes && (
                  <div className='flex items-center gap-1'>
                    <Clock className='h-4 w-4' />
                    <span>{Math.ceil(course.duration_minutes / 60 / 24 / 7)} semanas</span>
                  </div>
                )}
                <div className='flex items-center gap-1'>
                  <BookOpen className='h-4 w-4' />
                  <span>{course.lessons_count} lecciones</span>
                </div>
                {course.enrollment_count !== undefined && (
                  <div className='flex items-center gap-1'>
                    <Users className='h-4 w-4' />
                    <span>
                      {course.enrollment_count.toLocaleString()} estudiantes
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='flex items-center gap-3'>
                <Button className='flex-1' disabled={course.status !== 'published'}>
                  {course.status === 'published' ? (
                    <>
                      <Play className='mr-2 h-4 w-4' />
                      Comenzar Curso
                    </>
                  ) : (
                    <>
                      <Lock className='mr-2 h-4 w-4' />
                      Próximamente
                    </>
                  )}
                </Button>

                {course.status === 'published' && (
                  <Button variant='outline' size='sm'>
                    Vista Previa
                  </Button>
                )}
              </div>

              {/* Progress Bar for enrolled courses (placeholder) */}
              {course.status === 'published' && (
                <div className='bg-muted/30 mt-4 rounded-lg p-3'>
                  <div className='mb-2 flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Progreso del curso
                    </span>
                    <span className='font-medium'>0%</span>
                  </div>
                  <div className='bg-muted h-2 w-full rounded-full'>
                    <div
                      className='bg-primary h-2 rounded-full'
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
