import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import type { LearningPath, Course } from '@/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Book, Clock, Users, Plus, Trash2, GripVertical } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useCourses } from '@/hooks/use-courses'
import {
  useAddCourseToLearningPath,
  useRemoveCourseFromLearningPath,
  useReorderCourses,
} from '@/hooks/use-learning-path-courses'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

interface LearningPathCoursesProps {
  learningPath: LearningPath
}

interface SortableCourseItemProps {
  course: Course
  index: number
  onRemove: (courseId: number) => void
}

function SortableCourseItem({
  course,
  index,
  onRemove,
}: SortableCourseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return (
          <Badge
            variant='outline'
            className='border-blue-200 bg-blue-50 text-blue-700'
          >
            Principiante
          </Badge>
        )
      case 'intermediate':
        return (
          <Badge
            variant='outline'
            className='border-yellow-200 bg-yellow-50 text-yellow-700'
          >
            Intermedio
          </Badge>
        )
      case 'advanced':
        return (
          <Badge
            variant='outline'
            className='border-red-200 bg-red-50 text-red-700'
          >
            Avanzado
          </Badge>
        )
      default:
        return <Badge variant='outline'>{difficulty}</Badge>
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'shadow-lg' : ''}
    >
      <CardContent className='p-4'>
        <div className='flex items-start gap-3'>
          <button
            className='mt-1 cursor-grab touch-none active:cursor-grabbing'
            {...attributes}
            {...listeners}
          >
            <GripVertical className='h-5 w-5 text-muted-foreground' />
          </button>
          <div className='flex-1'>
            <div className='mb-2 flex items-center gap-2'>
              <span className='text-sm font-medium text-muted-foreground'>
                #{index + 1}
              </span>
              <h4 className='font-medium'>{course.title}</h4>
              {getDifficultyBadge(course.difficulty_level)}
            </div>
            <p className='mb-3 line-clamp-2 text-sm text-muted-foreground'>
              {course.description}
            </p>
            <div className='flex gap-4 text-sm text-muted-foreground'>
              <div className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                <span>{Math.round(course.duration_minutes / 60)}h</span>
              </div>
              <div className='flex items-center gap-1'>
                <Users className='h-4 w-4' />
                <span>{course.enrollment_count} estudiantes</span>
              </div>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onRemove(course.id)}
            className='text-red-600 hover:bg-red-50 hover:text-red-700'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function LearningPathCourses({
  learningPath,
}: LearningPathCoursesProps) {
  const { academySlug, learningPathSlug } = useParams({
    from: '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/courses',
  })
  const { currentAcademy } = useAuthStore()

  const [courses, setCourses] = useState(learningPath.courses || [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const { data: allCoursesData } = useCourses(currentAcademy?.id || 0)
  const addCourseMutation = useAddCourseToLearningPath(
    academySlug,
    learningPathSlug
  )
  const removeCourseMutation = useRemoveCourseFromLearningPath(
    academySlug,
    learningPathSlug
  )
  const reorderMutation = useReorderCourses(academySlug, learningPathSlug)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Update local state when learningPath prop changes
  useEffect(() => {
    if (learningPath.courses) {
      setCourses(learningPath.courses)
    }
  }, [learningPath.courses])

  // Filter available courses (exclude already added ones and ensure same academy)
  const assignedCourseIds = new Set(courses.map((c: Course) => c.id))
  const allCourses = allCoursesData || []
  const availableCourses = allCourses
    .filter((course) => !assignedCourseIds.has(course.id))
    .filter((course) => course.academy?.id === learningPath.academy.id) // Ensure same academy
    .filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setCourses((items: Course[]) => {
        const oldIndex = items.findIndex((item: Course) => item.id === active.id)
        const newIndex = items.findIndex((item: Course) => item.id === over.id)
        const newOrder = arrayMove(items, oldIndex, newIndex)

        // Save new order to backend
        reorderMutation.mutate(newOrder.map((c: Course) => c.id))

        return newOrder
      })
    }
  }

  const handleAddCourse = async (courseId: number) => {
    await addCourseMutation.mutateAsync(courseId)
    setIsAddDialogOpen(false)
    setSearchTerm('')
  }

  const handleRemoveCourse = async (courseId: number) => {
    await removeCourseMutation.mutateAsync(courseId)
    setCourses((prev: Course[]) => prev.filter((c: Course) => c.id !== courseId))
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return (
          <Badge
            variant='outline'
            className='border-blue-200 bg-blue-50 text-blue-700'
          >
            Principiante
          </Badge>
        )
      case 'intermediate':
        return (
          <Badge
            variant='outline'
            className='border-yellow-200 bg-yellow-50 text-yellow-700'
          >
            Intermedio
          </Badge>
        )
      case 'advanced':
        return (
          <Badge
            variant='outline'
            className='border-red-200 bg-red-50 text-red-700'
          >
            Avanzado
          </Badge>
        )
      default:
        return <Badge variant='outline'>{difficulty}</Badge>
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold'>
            Cursos en la Ruta de Aprendizaje
          </h2>
          <p className='text-sm text-muted-foreground'>
            {courses.length} curso{courses.length !== 1 ? 's' : ''} en esta ruta
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Agregar Curso
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Agregar Curso a la Ruta de Aprendizaje</DialogTitle>
              <DialogDescription>
                Selecciona un curso para agregar a esta ruta de aprendizaje
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <Input
                placeholder='Buscar cursos...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className='max-h-96 space-y-2 overflow-y-auto'>
                {availableCourses.length === 0 ? (
                  <p className='py-4 text-center text-sm text-muted-foreground'>
                    {searchTerm
                      ? 'No se encontraron cursos'
                      : 'Todos los cursos ya están agregados'}
                  </p>
                ) : (
                  availableCourses.map((course) => (
                    <Card
                      key={course.id}
                      className='cursor-pointer transition-colors hover:bg-gray-50'
                      onClick={() => handleAddCourse(course.id)}
                    >
                      <CardContent className='p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex-1'>
                            <div className='mb-1 flex items-center gap-2'>
                              <h4 className='font-medium'>{course.title}</h4>
                              {getDifficultyBadge(course.difficulty_level)}
                            </div>
                            <p className='line-clamp-1 text-sm text-muted-foreground'>
                              {course.description}
                            </p>
                          </div>
                          <Plus className='h-5 w-5 text-muted-foreground' />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assigned Courses with Drag & Drop */}
      {courses.length === 0 ? (
        <div className='rounded-lg border-2 border-dashed border-gray-200 py-8 text-center'>
          <Book className='mx-auto mb-3 h-8 w-8 text-muted-foreground' />
          <h3 className='mb-1 text-sm font-medium text-foreground'>
            No hay cursos asignados
          </h3>
          <p className='mb-4 text-sm text-muted-foreground'>
            Esta ruta de aprendizaje aún no tiene cursos
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} variant='outline'>
            <Plus className='mr-2 h-4 w-4' />
            Agregar Primer Curso
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            Arrastra y suelta para reordenar los cursos
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={courses.map((c: Course) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className='space-y-3'>
                {courses.map((course: Course, index: number) => (
                  <SortableCourseItem
                    key={course.id}
                    course={course}
                    index={index}
                    onRemove={handleRemoveCourse}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}
