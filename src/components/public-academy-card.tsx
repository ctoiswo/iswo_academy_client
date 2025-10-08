import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  Users,
  BookOpen,
  Star,
  Clock,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Academy {
  id: number
  name: string
  slug: string
  description?: string
  instructor?: string
  students?: number
  rating?: number
  courses?: number
  image: string
  category?: string
  duration?: string
  level?: 'Principiante' | 'Intermedio' | 'Avanzado'
  price?: number
}

interface PublicAcademyCardProps {
  academy: Academy
  index?: number
}

export function PublicAcademyCard({
  academy,
  index = 0,
}: PublicAcademyCardProps) {
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  }

  const imageVariants = {
    hover: { scale: 1.05 },
  }

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Principiante':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermedio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Avanzado':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial='hidden'
      animate='visible'
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className='mx-auto w-full max-w-sm'
    >
      <Card className='bg-card group cursor-pointer overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl'>
        {/* Image Container */}
        <div className='relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50'>
          <motion.img
            src={academy.image}
            alt={academy.name}
            className='h-full w-full object-cover'
            variants={imageVariants}
            whileHover='hover'
            transition={{ duration: 0.3 }}
          />

          {/* Overlay con categoria */}
          {academy.category && (
            <div className='absolute top-4 left-4'>
              <Badge
                variant='secondary'
                className='bg-white/90 font-medium text-gray-800'
              >
                {academy.category}
              </Badge>
            </div>
          )}

          {/* Level badge */}
          {academy.level && (
            <div className='absolute top-4 right-4'>
              <Badge className={getLevelColor(academy.level)}>
                {academy.level}
              </Badge>
            </div>
          )}

          {/* Rating overlay */}
          {academy.rating && (
            <div className='bg-background/95 absolute right-4 bottom-4 flex items-center gap-1 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur-sm'>
              <Star className='h-4 w-4 fill-current text-yellow-500' />
              <span className='text-foreground text-sm font-semibold'>
                {academy.rating}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className='p-6'>
          {/* Title */}
          <h3 className='text-foreground mb-2 line-clamp-2 text-xl font-bold transition-colors group-hover:text-blue-600'>
            {academy.name}
          </h3>

          {/* Description */}
          {academy.description && (
            <p className='text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed'>
              {academy.description}
            </p>
          )}

          {/* Instructor */}
          {academy.instructor && (
            <div className='mb-4 flex items-center gap-2'>
              <GraduationCap className='text-muted-foreground h-4 w-4' />
              <span className='text-foreground text-sm font-medium'>
                {academy.instructor}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className='mb-4 grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-blue-600' />
              <span className='text-muted-foreground text-sm'>
                {academy.students?.toLocaleString() || '0'} estudiantes
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <BookOpen className='h-4 w-4 text-green-600' />
              <span className='text-muted-foreground text-sm'>
                {academy.courses || 0} cursos
              </span>
            </div>
          </div>

          {/* Duration and Price */}
          <div className='mb-4 flex items-center justify-between'>
            {academy.duration && (
              <div className='flex items-center gap-1'>
                <Clock className='text-muted-foreground h-4 w-4' />
                <span className='text-muted-foreground text-sm'>
                  {academy.duration}
                </span>
              </div>
            )}

            {academy.price !== undefined && (
              <div className='text-right'>
                {academy.price === 0 ? (
                  <Badge className='border-green-200 bg-green-100 text-green-800'>
                    Gratis
                  </Badge>
                ) : (
                  <span className='text-foreground text-lg font-bold'>
                    ${academy.price.toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button className='group/btn w-full' asChild>
            <Link to='/academies/$slug' params={{ slug: academy.slug }}>
              Ver Academia
              <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1' />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
