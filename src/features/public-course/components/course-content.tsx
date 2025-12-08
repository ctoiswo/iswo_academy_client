import type { Course } from '@/types'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface CourseContentProps {
  course: Course & {
    whatYoullLearn: string[]
    requirements: string[]
    sections: Array<{
      id: number
      title: string
      lessons: number
      duration: number
    }>
  }
}

export function CourseContent({ course }: CourseContentProps) {
  return (
    <div className='container pb-8'>
      <div className='grid gap-8 lg:grid-cols-3'>
        <div className='space-y-8 lg:col-span-2'>
          {/* What you'll learn */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BookOpen className='h-5 w-5' />
                  Lo que aprenderás
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid gap-3 md:grid-cols-2'>
                  {course.whatYoullLearn.map((item, index) => (
                    <div key={index} className='flex items-start gap-2'>
                      <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500' />
                      <span className='text-sm'>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Course Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Contenido del curso</CardTitle>
                <CardDescription>
                  {course.sections.length} secciones •{' '}
                  {course.sections.reduce((sum, s) => sum + s.lessons, 0)}{' '}
                  lecciones • {Math.round(course.duration_minutes / 60)} horas
                  de contenido
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {course.sections.map((section, index) => (
                  <div key={section.id} className='rounded-lg border p-4'>
                    <div className='flex items-center justify-between'>
                      <h4 className='font-medium'>
                        {index + 1}. {section.title}
                      </h4>
                      <div className='text-muted-foreground text-sm'>
                        {section.lessons} lecciones •{' '}
                        {Math.round(section.duration / 60)}h
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  {course.requirements.map((req, index) => (
                    <div key={index} className='flex items-start gap-2'>
                      <div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500' />
                      <span className='text-sm'>{req}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
