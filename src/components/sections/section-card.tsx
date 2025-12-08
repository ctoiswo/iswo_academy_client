import { useState, useEffect } from 'react'
import type { Lesson, Section } from '@/types'
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
  useSortable,
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  GripVertical,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useLessons, useReorderLesson } from '@/hooks/use-lessons'
import { useDeleteSection } from '@/hooks/use-sections'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LessonCard } from '@/components/lessons/lesson-card'

interface SectionCardProps {
  section: Section
  academySlug: string
  courseSlug: string
  onEdit: (section: Section) => void
  onCreateLesson: (sectionId: number) => void
  onEditLesson: (lesson: Lesson, sectionId: number) => void
}

export function SectionCard({
  section,
  academySlug,
  courseSlug,
  onEdit,
  onCreateLesson,
  onEditLesson,
}: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [localLessons, setLocalLessons] = useState<Lesson[]>([])

  const deleteSection = useDeleteSection(academySlug, courseSlug)
  const { data: lessons } = useLessons(academySlug, courseSlug, section.id)
  const reorderLesson = useReorderLesson(academySlug, courseSlug, section.id)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const lessonsList = Array.isArray(lessons) ? lessons : []

  // Sync local lessons with fetched data
  useEffect(() => {
    if (lessonsList.length > 0) {
      setLocalLessons(lessonsList)
    }
  }, [lessonsList])

  const lessonSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleLessonDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = localLessons.findIndex((l) => l.id === active.id)
      const newIndex = localLessons.findIndex((l) => l.id === over.id)

      const newLessons = arrayMove(localLessons, oldIndex, newIndex)
      setLocalLessons(newLessons)

      // Update position on backend (position is 1-indexed)
      reorderLesson.mutate({
        lessonId: active.id as number,
        position: newIndex + 1,
      })
    }
  }

  const handleDelete = () => {
    deleteSection.mutate(section.id, {
      onSuccess: () => setDeleteDialogOpen(false),
    })
  }

  return (
    <>
      <Card ref={setNodeRef} style={style}>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex flex-1 items-center gap-3'>
              <Button
                variant='ghost'
                size='sm'
                className='cursor-grab active:cursor-grabbing'
                {...attributes}
                {...listeners}
              >
                <GripVertical className='h-4 w-4' />
              </Button>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronDown className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </Button>

              <div className='flex-1'>
                <CardTitle className='text-lg'>{section.title}</CardTitle>
                {section.description && (
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {section.description}
                  </p>
                )}
              </div>

              <div className='flex items-center gap-2'>
                <Badge variant='outline'>
                  {lessonsList.length} lección
                  {lessonsList.length !== 1 ? 'es' : ''}
                </Badge>
                {(() => {
                  const totalDuration = lessonsList.reduce(
                    (sum, lesson) => sum + (lesson.duration_minutes || 0),
                    0
                  )
                  return totalDuration > 0 ? (
                    <Badge variant='secondary'>
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    </Badge>
                  ) : null
                })()}
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button variant='ghost' size='sm' onClick={() => onEdit(section)}>
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
        </CardHeader>

        {isExpanded && (
          <CardContent className='space-y-3'>
            {lessonsList.length === 0 ? (
              <div className='text-muted-foreground py-8 text-center'>
                <p className='mb-3 text-sm'>No hay lecciones en esta sección</p>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => onCreateLesson(section.id)}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Añadir Primera Lección
                </Button>
              </div>
            ) : (
              <>
                <DndContext
                  sensors={lessonSensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleLessonDragEnd}
                >
                  <SortableContext
                    items={localLessons.map((l) => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className='space-y-2'>
                      {localLessons.map((lesson) => (
                        <LessonCard
                          key={lesson.id}
                          lesson={lesson}
                          sectionId={section.id}
                          academySlug={academySlug}
                          courseSlug={courseSlug}
                          onEdit={(lesson) => onEditLesson(lesson, section.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full'
                  onClick={() => onCreateLesson(section.id)}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  Añadir Lección
                </Button>
              </>
            )}
          </CardContent>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará permanentemente la sección "{section.title}".
              {lessonsList.length > 0 && (
                <span className='text-destructive mt-2 block font-medium'>
                  Esta sección contiene {lessonsList.length} lección
                  {lessonsList.length !== 1 ? 'es' : ''}. Debes eliminarlas
                  primero antes de eliminar la sección.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteSection.isPending || lessonsList.length > 0}
              className='bg-red-600 hover:bg-red-700'
            >
              {deleteSection.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
