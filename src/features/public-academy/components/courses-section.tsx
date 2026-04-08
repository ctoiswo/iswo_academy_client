import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BookOpen, Clock, Users, Play } from 'lucide-react'
import { formatDifficulty } from '@/lib/formatters/difficulty'
import { formatPrice } from '@/lib/formatters/price'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface CoursesSectionProps {
  courses: any[]
  academyName?: string
  academySlug?: string
}

export function CoursesSection({ courses, academySlug }: CoursesSectionProps) {
  return (
    <section className='py-16'>
      <div className='container'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='mb-12 text-center'
        >
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Cursos disponibles ({courses.length})
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            Explora todo el contenido disponible en esta academia
          </p>
        </motion.div>

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='py-16 text-center'
          >
            <BookOpen className='text-muted-foreground mx-auto mb-4 h-16 w-16' />
            <h3 className='mb-2 text-xl font-semibold'>
              Aún no hay cursos disponibles
            </h3>
            <p className='text-muted-foreground mx-auto mb-6 max-w-md'>
              Esta academia está preparando contenido increíble. Regresa pronto
              para ver los nuevos cursos.
            </p>
            <Button variant='outline' asChild>
              <Link to='/academies'>Ver otras academias</Link>
            </Button>
          </motion.div>
        ) : (
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {courses.map((course, index) => {
              const creatorName =
                course.creator?.name ||
                `${course.creator?.first_name || ''} ${course.creator?.last_name || ''}`.trim() ||
                'Instructor'

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Link
                    to={
                      (academySlug
                        ? `/courses/${course.slug}?fromAcademySlug=${academySlug}`
                        : `/courses/${course.slug}`) as any
                    }
                  >
                    <Card className='group h-full cursor-pointer overflow-hidden'>
                      <div className='relative'>
                        <img
                          src={
                            course.thumbnail_url ||
                            'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2'
                          }
                          alt={course.title}
                          className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                        <div className='absolute top-4 left-4'>
                          <Badge variant='secondary'>
                            {formatDifficulty(course.difficulty_level)}
                          </Badge>
                        </div>
                        <div className='absolute top-4 right-4'>
                          <div className='rounded bg-black/70 px-2 py-1 text-sm font-medium text-white'>
                            {course.is_free
                              ? 'Gratis'
                              : formatPrice(course.price)}
                          </div>
                        </div>
                        <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20'>
                          <Play className='h-12 w-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className='line-clamp-2'>
                          {course.title}
                        </CardTitle>
                        <CardDescription className='line-clamp-2'>
                          {course.description || 'Sin descripción'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='space-y-4'>
                          <div className='flex items-center justify-between text-sm'>
                            <div className='flex items-center space-x-4'>
                              <div className='flex items-center space-x-1'>
                                <Clock className='text-muted-foreground h-4 w-4' />
                                <span>
                                  {course.duration_minutes > 0
                                    ? `${Math.round(course.duration_minutes / 60)}h`
                                    : 'Pronto'}
                                </span>
                              </div>
                              <div className='flex items-center space-x-1'>
                                <BookOpen className='text-muted-foreground h-4 w-4' />
                                <span>
                                  {course.status === 1
                                    ? 'Disponible'
                                    : 'Próximamente'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className='flex items-center justify-between text-sm'>
                            <div className='text-muted-foreground text-sm'>
                              Por {creatorName}
                            </div>
                            {course.enrollment_count !== undefined && (
                              <div className='flex items-center space-x-1'>
                                <Users className='text-muted-foreground h-4 w-4' />
                                <span>
                                  {course.enrollment_count} estudiantes
                                </span>
                              </div>
                            )}
                          </div>
                          <Button className='w-full'>
                            Ver detalles del curso
                            <Play className='ml-2 h-4 w-4' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
