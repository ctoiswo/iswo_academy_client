import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import type { Lesson } from '@/services/lesson-service'
import type { Section } from '@/services/section-service'
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
} from '@dnd-kit/sortable'
import { Plus, FolderOpen } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useCourseBySlug } from '@/hooks/use-courses'
import { useSections, useReorderSection } from '@/hooks/use-sections'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateLessonDialog } from '@/components/lessons/create-lesson-dialog'
import { EditLessonDialog } from '@/components/lessons/edit-lesson-dialog'
import { CreateSectionDialog } from '@/components/sections/create-section-dialog'
import { EditSectionDialog } from '@/components/sections/edit-section-dialog'
import { SectionCard } from '@/components/sections/section-card'

export default function CourseLessonsPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const { currentAcademy } = useAuthStore()

  // Check if user is student
  const isStudent = currentAcademy?.user_role === 'student'

  const [createSectionDialogOpen, setCreateSectionDialogOpen] = useState(false)
  const [editSectionDialogOpen, setEditSectionDialogOpen] = useState(false)
  const [createLessonDialogOpen, setCreateLessonDialogOpen] = useState(false)
  const [editLessonDialogOpen, setEditLessonDialogOpen] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null
  )
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [editingLesson, setEditingLesson] = useState<{
    lesson: Lesson
    sectionId: number
  } | null>(null)
  const [localSections, setLocalSections] = useState<Section[]>([])

  const academyId = currentAcademy?.id
  const {
    data: course,
    isLoading,
    error,
  } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)
  const { data: sectionsData, isLoading: sectionsLoading } = useSections(
    academySlug,
    courseSlug
  )
  const reorderSection = useReorderSection(academySlug, courseSlug)

  const sections = Array.isArray(sectionsData) ? sectionsData : []

  // Sync local sections with fetched data
  useEffect(() => {
    if (sections.length > 0) {
      setLocalSections(sections)
    }
  }, [sections])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = localSections.findIndex((s) => s.id === active.id)
      const newIndex = localSections.findIndex((s) => s.id === over.id)

      const newSections = arrayMove(localSections, oldIndex, newIndex)
      setLocalSections(newSections)

      // Update position on backend (position is 1-indexed)
      reorderSection.mutate({
        sectionId: active.id as number,
        position: newIndex + 1,
      })
    }
  }

  const handleCreateLesson = (sectionId: number) => {
    setSelectedSectionId(sectionId)
    setCreateLessonDialogOpen(true)
  }

  const handleEditSection = (section: Section) => {
    setEditingSection(section)
    setEditSectionDialogOpen(true)
  }

  const handleEditLesson = (lesson: Lesson, sectionId: number) => {
    setEditingLesson({ lesson, sectionId })
    setEditLessonDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className='container mx-auto py-8'>
        <Skeleton className='h-64' />
      </div>
    )
  }

  if (error || !course) {
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

  if (sectionsLoading) {
    return (
      <div className='container mx-auto py-8'>
        <Skeleton className='h-64' />
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
        <p className='text-gray-600'>
          Gestiona lecciones, secciones y contenido del curso
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Contenido del Curso</CardTitle>
              <CardDescription>
                {sections.length} sección{sections.length !== 1 ? 'es' : ''} •{' '}
                {course.lessons_count || 0} lección
                {course.lessons_count !== 1 ? 'es' : ''}
              </CardDescription>
            </div>
            {!isStudent && (
              <Button onClick={() => setCreateSectionDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Nueva Sección
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {sections.length === 0 ? (
            <div className='py-12 text-center text-gray-500'>
              <FolderOpen className='mx-auto mb-4 h-12 w-12' />
              {isStudent ? (
                <>
                  <h3 className='mb-2 text-lg font-medium'>
                    Aún no hay contenido disponible
                  </h3>
                  <p className='mb-4'>
                    El instructor está preparando el material del curso. Vuelve
                    pronto para ver las lecciones.
                  </p>
                </>
              ) : (
                <>
                  <h3 className='mb-2 text-lg font-medium'>
                    Aún no hay secciones
                  </h3>
                  <p className='mb-4'>
                    Comienza a construir tu curso creando secciones y añadiendo
                    lecciones
                  </p>
                  <Button onClick={() => setCreateSectionDialogOpen(true)}>
                    <Plus className='mr-2 h-4 w-4' />
                    Crear Primera Sección
                  </Button>
                </>
              )}
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localSections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className='space-y-4'>
                  {localSections.map((section) => (
                    <SectionCard
                      key={section.id}
                      section={section}
                      academySlug={academySlug}
                      courseSlug={courseSlug}
                      onEdit={handleEditSection}
                      onCreateLesson={handleCreateLesson}
                      onEditLesson={handleEditLesson}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateSectionDialog
        open={createSectionDialogOpen}
        onOpenChange={setCreateSectionDialogOpen}
        academySlug={academySlug}
        courseSlug={courseSlug}
      />

      <EditSectionDialog
        open={editSectionDialogOpen}
        onOpenChange={setEditSectionDialogOpen}
        academySlug={academySlug}
        courseSlug={courseSlug}
        section={editingSection}
      />

      {selectedSectionId && (
        <CreateLessonDialog
          open={createLessonDialogOpen}
          onOpenChange={setCreateLessonDialogOpen}
          academySlug={academySlug}
          courseSlug={courseSlug}
          sectionId={selectedSectionId}
        />
      )}

      {editingLesson && (
        <EditLessonDialog
          open={editLessonDialogOpen}
          onOpenChange={setEditLessonDialogOpen}
          academySlug={academySlug}
          courseSlug={courseSlug}
          sectionId={editingLesson.sectionId}
          lesson={editingLesson.lesson}
        />
      )}
    </div>
  )
}
