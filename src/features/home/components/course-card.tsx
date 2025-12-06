/**
 * Course Card Component
 * Displays a single course card with link
 */
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Clock, Users } from 'lucide-react'
import { formatPrice, formatDifficulty } from '@/lib/formatters'
import { generateCourseSlug } from '@/lib/helpers'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface CourseCardProps {
  course: {
    id: number
    title: string
    slug?: string
    thumbnail_url?: string | null
    difficulty_level: 'beginner' | 'intermediate' | 'advanced'
    is_free: boolean
    price: number
    duration_minutes: number
    enrollment_count?: number
    status: string
    creator?: {
      id: number
      name?: string
    }
  }
  index?: number
}

export function CourseCard({ course, index = 0 }: CourseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
      }}
      whileHover={{ y: -5 }}
    >
      <Link
        to='/courses/$courseSlug'
        params={{ courseSlug: generateCourseSlug(course) }}
      >
        <Card className='group h-full cursor-pointer overflow-hidden'>
          <div className='relative'>
            <img
              src={
                course?.thumbnail_url ||
                'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'
              }
              alt={course?.title}
              className='h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute top-3 left-3'>
              <Badge variant='secondary'>
                {formatDifficulty(course?.difficulty_level)}
              </Badge>
            </div>
            <div className='absolute top-3 right-3'>
              <div className='rounded bg-black/70 px-2 py-1 text-xs font-medium text-white'>
                {course?.is_free ? 'Gratis' : formatPrice(course?.price)}
              </div>
            </div>
          </div>
          <CardHeader className='pb-4'>
            <CardTitle className='line-clamp-2 text-lg'>
              {course?.title}
            </CardTitle>
            <CardDescription className='line-clamp-1 text-sm'>
              Por {course?.creator?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center space-x-3'>
                <div className='flex items-center space-x-1'>
                  <Clock className='text-muted-foreground h-3 w-3' />
                  <span className='text-xs'>
                    {Math.round(course?.duration_minutes / 60)}h
                  </span>
                </div>
                <div className='flex items-center space-x-1'>
                  <Users className='text-muted-foreground h-3 w-3' />
                  <span className='text-xs'>{course?.enrollment_count}</span>
                </div>
              </div>
              <Badge variant='outline' className='text-xs'>
                {course?.status === 'published' ? 'Disponible' : 'Próximamente'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
