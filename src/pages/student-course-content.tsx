import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { BookOpen, FileText, Clock, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useCourseBySlug } from '@/hooks/use-courses'
import { useSections } from '@/hooks/use-sections'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

type TabType = 'lessons' | 'assignments'

export default function StudentCourseContentPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const navigate = useNavigate()
  const { currentAcademy } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('lessons')

  const academyId = currentAcademy?.id
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)
  
  const { data: sectionsData, isLoading: sectionsLoading } = useSections(
    academySlug,
    courseSlug
  )

  const sections = Array.isArray(sectionsData) ? sectionsData : []
  const isLoading = courseLoading || sectionsLoading

  if (isLoading) {
    return (
      <div className='container mx-auto py-8'>
        <Skeleton className='h-64' />
      </div>
    )
  }

  if (courseError || !course) {
    return (
      <div className='container mx-auto py-8'>
        <div className='py-12 text-center'>
          <h3 className='mb-2 text-lg font-bold text-red-600'>
            Error al Cargar el Curso
          </h3>
          <p className='text-gray-600'>
            Curso no encontrado o no tienes permiso para acceder
          </p>
        </div>
      </div>
    )
  }

  const totalLessons = sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0)
  const completedLessons = 0 // TODO: Get from enrollment progress
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

  return (
    <div className='container mx-auto py-8'>
      {/* Course Header */}
      <div className='mb-8'>
        <div className='mb-4'>
          <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
          <p className='text-gray-600'>{course.description}</p>
        </div>

        {/* Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <BookOpen className='h-5 w-5' />
              Tu Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>{completedLessons} de {totalLessons} lecciones completadas</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className='h-2' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className='mb-6 flex gap-2 border-b'>
        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 transition-colors ${
            activeTab === 'lessons'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className='h-4 w-4' />
          Clases
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 transition-colors ${
            activeTab === 'assignments'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className='h-4 w-4' />
          Tareas
        </button>
      </div>

      {/* Content */}
      {activeTab === 'lessons' && (
        <div className='space-y-4'>
          {sections.length === 0 ? (
            <Card>
              <CardContent className='py-12 text-center text-gray-500'>
                <BookOpen className='mx-auto mb-4 h-12 w-12' />
                <h3 className='mb-2 text-lg font-medium'>Aún no hay contenido disponible</h3>
                <p>
                  El instructor está preparando el material del curso. Vuelve pronto para ver las lecciones.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type='multiple' className='space-y-4'>
              {sections.map((section) => (
                <AccordionItem
                  key={section.id}
                  value={`section-${section.id}`}
                  className='rounded-lg border bg-white'
                >
                  <AccordionTrigger className='px-6 hover:no-underline'>
                    <div className='flex flex-1 items-center justify-between pr-4 text-left'>
                      <div>
                        <h3 className='font-semibold'>{section.title}</h3>
                        {section.description && (
                          <p className='text-sm text-gray-600'>{section.description}</p>
                        )}
                      </div>
                      <Badge variant='outline'>
                        {section.lessons?.length || 0} lecciones
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='px-6 pb-4'>
                    {section.lessons && section.lessons.length > 0 ? (
                      <div className='space-y-2'>
                        {section.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => {
                              // TODO: Navigate to lesson viewer
                              toast.info(`Navegación a lección no implementada aún (Lección ID: ${lesson.id})`)
                            }}
                            className='flex w-full items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50'
                          >
                            <div className='flex-shrink-0'>
                              <Clock className='h-5 w-5 text-blue-500' />
                            </div>
                            <div className='flex-1 text-left'>
                              <h4 className='font-medium'>{lesson.title}</h4>
                              {lesson.content && (
                                <p className='text-sm text-gray-600 line-clamp-1'>
                                  {lesson.content.substring(0, 100)}
                                </p>
                              )}
                            </div>
                            <ChevronRight className='h-5 w-5 text-gray-400' />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className='py-4 text-center text-sm text-gray-500'>
                        No hay lecciones en esta sección
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className='space-y-4'>
          <Card>
            <CardContent className='py-12 text-center text-gray-500'>
              <FileText className='mx-auto mb-4 h-12 w-12' />
              <h3 className='mb-2 text-lg font-medium'>No hay tareas asignadas</h3>
              <p>
                Las tareas aparecerán aquí cuando el instructor las publique.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
