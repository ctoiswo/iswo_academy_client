import type { Course } from '@/types'
import { motion } from 'framer-motion'
import { Clock, Users, Star, Play } from 'lucide-react'
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
  }
  getDifficultyColor: (level: string) => string
  formatDifficulty: (level: string) => string
}

export function CourseHero({
  course,
  getDifficultyColor,
  formatDifficulty,
}: CourseHeroProps) {
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
              >
                <Play className='mr-2 h-5 w-5' />
                Vista previa del curso
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
