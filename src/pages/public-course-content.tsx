import { useParams } from '@tanstack/react-router'
import type { Lesson } from '@/services/lesson-service'
import type { Section } from '@/services/section-service'
import { BookOpen, FileText, Clock, Lock } from 'lucide-react'
import { useCourseBySlug } from '@/hooks/use-courses'
import { useSections } from '@/hooks/use-sections'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Header } from '@/features/home/components/header'

// Extended section type that includes lessons
type SectionWithLessons = Section & {
  lessons?: Lesson[]
}

export function PublicCourseContentPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourseBySlug(0, courseSlug) // Use 0 for public access

  const { data: sectionsData, isLoading: sectionsLoading } = useSections(
    academySlug,
    courseSlug
  )

  const sections = Array.isArray(sectionsData)
    ? (sectionsData as SectionWithLessons[])
    : []
  const isLoading = courseLoading || sectionsLoading

  if (isLoading) {
    return (
      <div className='bg-background min-h-screen'>
        <Header />
        <div className='container mx-auto px-4 py-8'>
          <div className='space-y-6'>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-96 w-full' />
          </div>
        </div>
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className='bg-background min-h-screen'>
        <Header />
        <div className='container mx-auto px-4 py-8'>
          <Card>
            <CardContent className='py-12 text-center'>
              <BookOpen className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <h3 className='mb-2 text-lg font-semibold'>
                Curso no encontrado
              </h3>
              <p className='text-muted-foreground'>
                El curso que buscas no está disponible o no existe.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Calculate progress (for public view, show 0% as user is not enrolled)
  const totalLessons =
    sections.length > 0
      ? sections.reduce(
          (acc, section) => acc + ((section as any).lessons?.length || 0),
          0
        )
      : 0
  const completedLessons = 0 // Public users haven't completed any lessons
  const progressPercentage =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className='bg-background min-h-screen'>
      <Header />
      <div className='container mx-auto px-4 py-8'>
        <div className='space-y-6'>
          {/* Course Header */}
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold'>{course.title}</h1>
              <p className='text-muted-foreground mt-2'>
                Vista previa del contenido del curso
              </p>
            </div>
            <Badge variant='secondary'>Vista pública</Badge>
          </div>

          {/* Course Description */}
          {course.description && (
            <Card>
              <CardHeader>
                <CardTitle>Descripción del curso</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>{course.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Progress Card - showing 0% for public users */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <BookOpen className='h-5 w-5' />
                Progreso del curso
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between text-sm'>
                <span>Progreso general</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className='w-full' />
              <div className='text-muted-foreground flex justify-between text-sm'>
                <span>
                  {completedLessons} de {totalLessons} lecciones completadas
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='h-5 w-5' />
                Contenido del curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sections.length === 0 ? (
                <div className='py-8 text-center'>
                  <FileText className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <p className='text-muted-foreground'>
                    Aún no hay contenido disponible para este curso.
                  </p>
                </div>
              ) : (
                <Accordion type='single' collapsible className='w-full'>
                  {sections.map((section, index) => (
                    <AccordionItem key={section.id} value={`section-${index}`}>
                      <AccordionTrigger className='hover:no-underline'>
                        <div className='flex w-full items-center justify-between pr-4'>
                          <div className='flex items-center gap-3'>
                            <Badge variant='outline'>{index + 1}</Badge>
                            <span className='text-left font-medium'>
                              {section.title}
                            </span>
                          </div>
                          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                            <Clock className='h-4 w-4' />
                            {(section as any).lessons?.length || 0} lecciones
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {(section as any).lessons &&
                        (section as any).lessons.length > 0 ? (
                          <div className='space-y-2 pl-4'>
                            {(section as any).lessons.map((lesson: any) => (
                              <div
                                key={lesson.id}
                                className='bg-muted/50 flex items-center justify-between rounded-lg border p-3'
                              >
                                <div className='flex items-center gap-3'>
                                  <Lock className='text-muted-foreground h-4 w-4' />
                                  <div>
                                    <p className='font-medium'>
                                      {lesson.title}
                                    </p>
                                    {lesson.description && (
                                      <p className='text-muted-foreground text-sm'>
                                        {lesson.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                                  <Clock className='h-4 w-4' />
                                  <span>{lesson.duration || '5'} min</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className='text-muted-foreground pl-4 text-sm'>
                            No hay lecciones disponibles en esta sección.
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>

          {/* Enrollment CTA */}
          <Card className='bg-primary/5 border-primary/20'>
            <CardContent className='py-8 text-center'>
              <Lock className='text-primary mx-auto mb-4 h-12 w-12' />
              <h3 className='mb-2 text-xl font-semibold'>
                ¿Quieres acceder a este contenido?
              </h3>
              <p className='text-muted-foreground mb-4'>
                Inscríbete en este curso para acceder a todas las lecciones,
                ejercicios y material adicional.
              </p>
              <div className='flex justify-center gap-3'>
                <button className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2 transition-colors'>
                  Inscribirse ahora
                </button>
                <button className='border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-lg border px-6 py-2 transition-colors'>
                  Más información
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
