/**
 * Courses Section Component
 * Displays popular courses grouped by category
 */
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { CourseCard } from './course-card'

interface CoursesSectionProps {
  data: Array<{
    category: {
      id: number
      name: string
      description?: string
    }
    courses: Array<any>
  }>
  isLoading: boolean
}

export function CoursesSection({ data, isLoading }: CoursesSectionProps) {
  const { t } = useTranslation()

  return (
    <section className='bg-muted/50 py-20'>
      <div className='container'>
        <motion.div
          className='mb-16 text-center'
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            {t('home.courses.title')}
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            {t('home.courses.description')}
          </p>
        </motion.div>

        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin' />
            <span className='text-muted-foreground ml-2'>
              {t('home.courses.loading')}
            </span>
          </div>
        ) : (
          <div className='space-y-16'>
            {data.map((categoryData, categoryIndex) => {
              const { category, courses } = categoryData

              if (!courses || courses.length === 0) return null

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                >
                  <div className='mb-8'>
                    <h3 className='mb-2 text-2xl font-bold'>{category.name}</h3>
                    <p className='text-muted-foreground'>
                      {category.description}
                    </p>
                  </div>

                  <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    {courses.map((course, courseIndex) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        index={courseIndex}
                      />
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.div
          className='mt-12 text-center'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Button size='lg' variant='outline' asChild>
            <Link to='/academies'>
              {t('home.courses.exploreAll')}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
