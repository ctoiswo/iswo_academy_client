import { useState } from 'react'
import type { Course } from '@/types'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Target,
  CheckCircle,
  ListChecks,
  ChevronDown,
  PlayCircle,
  Trophy,
  Award,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
  const [expandedSections, setExpandedSections] = useState<number[]>([])

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  return (
    <div className='space-y-8'>
      {/* What you'll learn - Destacado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className='border-primary/20 from-primary/5 bg-gradient-to-br to-transparent'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-2xl'>
              <Target className='text-primary h-6 w-6' />
              Lo que aprenderás
            </CardTitle>
            <CardDescription>
              Objetivos de aprendizaje que alcanzarás al completar este curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 sm:grid-cols-2'>
              {course.whatYoullLearn.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className='bg-background/80 flex items-start gap-3 rounded-lg p-3'
                >
                  <CheckCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-600' />
                  <span className='text-sm leading-relaxed font-medium'>
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Course Content - Curriculum detallado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle className='flex items-center gap-2 text-2xl'>
                  <BookOpen className='text-primary h-6 w-6' />
                  Contenido del curso
                </CardTitle>
                <CardDescription className='mt-2'>
                  {course.sections.length} secciones •{' '}
                  {course.sections.reduce((sum, s) => sum + s.lessons, 0)}{' '}
                  lecciones • {Math.round(course.duration_minutes / 60)}h{' '}
                  {course.duration_minutes % 60}min de contenido en total
                </CardDescription>
              </div>
              <Badge variant='secondary' className='hidden sm:flex'>
                <Trophy className='mr-1 h-3 w-3' />
                Contenido premium
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='space-y-3'>
            {course.sections.map((section, index) => {
              const isExpanded = expandedSections.includes(section.id)
              return (
                <div
                  key={section.id}
                  className='bg-card hover:border-primary/30 overflow-hidden rounded-lg border transition-all hover:shadow-md'
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className='hover:bg-accent/50 flex w-full items-center justify-between p-4 text-left transition-colors'
                  >
                    <div className='flex flex-1 items-start gap-3'>
                      <div className='bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold'>
                        {index + 1}
                      </div>
                      <div className='flex-1'>
                        <h4 className='leading-tight font-semibold'>
                          {section.title}
                        </h4>
                        <div className='text-muted-foreground mt-1 flex flex-wrap items-center gap-3 text-xs'>
                          <span className='flex items-center gap-1'>
                            <PlayCircle className='h-3 w-3' />
                            {section.lessons} lecciones
                          </span>
                          <span className='flex items-center gap-1'>
                            <BookOpen className='h-3 w-3' />
                            {Math.floor(section.duration / 60)}h{' '}
                            {section.duration % 60}min
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-muted-foreground h-5 w-5 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className='bg-accent/20 border-t p-4'>
                      <div className='space-y-2'>
                        {Array.from({ length: section.lessons }).map(
                          (_, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className='bg-background/60 flex items-center gap-3 rounded-md p-2 text-sm'
                            >
                              <PlayCircle className='text-muted-foreground h-4 w-4' />
                              <span>Lección {lessonIndex + 1}</span>
                              <span className='text-muted-foreground ml-auto text-xs'>
                                {Math.floor(section.duration / section.lessons)}
                                min
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
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
            <CardTitle className='flex items-center gap-2'>
              <ListChecks className='text-primary h-5 w-5' />
              Requisitos
            </CardTitle>
            <CardDescription>
              Lo que necesitas antes de empezar este curso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {course.requirements.map((req, index) => (
                <div
                  key={index}
                  className='bg-accent/30 flex items-start gap-3 rounded-lg border p-3'
                >
                  <div className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500' />
                  <span className='text-sm leading-relaxed'>{req}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Certificate Section */}
      {course.certificate_enabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className='border-amber-200 bg-gradient-to-br from-amber-50 to-transparent dark:border-amber-900 dark:from-amber-950/20'>
            <CardContent className='flex items-center gap-4 p-6'>
              <Award className='h-12 w-12 flex-shrink-0 text-amber-600' />
              <div>
                <h3 className='mb-1 font-semibold'>
                  Certificado de finalización
                </h3>
                <p className='text-muted-foreground text-sm'>
                  Obtén un certificado oficial al completar este curso que
                  podrás compartir en tu perfil profesional y redes sociales.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
