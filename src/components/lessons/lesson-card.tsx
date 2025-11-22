import { useState } from 'react'
import type { Lesson } from '@/services/lesson-service'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  PlayCircle,
  FileText,
  Pencil,
  Trash2,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDeleteLesson } from '@/hooks/use-lessons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface LessonCardProps {
  lesson: Lesson
  sectionId: number
  academySlug: string
  courseSlug: string
  onEdit?: (lesson: Lesson) => void
}

const lessonTypeIcons = {
  video: PlayCircle,
  text: FileText,
  quiz: FileText,
  assignment: FileText,
  interactive: FileText,
  document: FileText,
}

const lessonTypeLabels = {
  video: 'Video',
  text: 'Texto',
  quiz: 'Quiz',
  assignment: 'Tarea',
  interactive: 'Interactivo',
  document: 'Documento',
}

export function LessonCard({
  lesson,
  sectionId,
  academySlug,
  courseSlug,
  onEdit,
}: LessonCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const deleteLesson = useDeleteLesson(academySlug, courseSlug, sectionId)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = lessonTypeIcons[lesson.lesson_type]

  const handleDelete = () => {
    deleteLesson.mutate(lesson.id, {
      onSuccess: () => setDeleteDialogOpen(false),
    })
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'bg-card hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 transition-colors'
        )}
      >
        <Button
          variant='ghost'
          size='sm'
          className='cursor-grab px-2 active:cursor-grabbing'
          {...attributes}
          {...listeners}
        >
          <GripVertical className='h-4 w-4' />
        </Button>

        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full',
            lesson.lesson_type === 'video' ? 'bg-blue-100' : 'bg-gray-100'
          )}
        >
          <Icon
            className={cn(
              'h-5 w-5',
              lesson.lesson_type === 'video' ? 'text-blue-600' : 'text-gray-600'
            )}
          />
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <h4 className='truncate text-sm font-medium'>{lesson.title}</h4>
            {lesson.is_free && (
              <Badge variant='secondary' className='text-xs'>
                Gratis
              </Badge>
            )}
          </div>
          <div className='text-muted-foreground mt-1 flex items-center gap-2 text-xs'>
            <span>{lessonTypeLabels[lesson.lesson_type]}</span>
            {lesson.duration_minutes && lesson.duration_minutes > 0 && (
              <>
                <span>•</span>
                <Clock className='h-3 w-3' />
                <span>{lesson.duration_minutes} min</span>
              </>
            )}
            {lesson.processing_status &&
              lesson.processing_status !== 'completed' && (
                <>
                  <span>•</span>
                  <Badge variant='outline' className='text-xs'>
                    {lesson.processing_status === 'pending' && 'Pendiente'}
                    {lesson.processing_status === 'processing' && 'Procesando'}
                    {lesson.processing_status === 'failed' && 'Error'}
                  </Badge>
                </>
              )}
          </div>
        </div>

        <div className='flex items-center gap-1'>
          <Button variant='ghost' size='sm' onClick={() => onEdit?.(lesson)}>
            <Pencil className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará permanentemente la lección "{lesson.title}". Esta
              acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLesson.isPending}
              className='bg-red-600 hover:bg-red-700'
            >
              {deleteLesson.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
