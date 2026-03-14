import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
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
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus, FolderOpen, ArrowLeft, BookOpen, LayoutList } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useCourse } from '@/hooks/use-courses'
import { useSections, useReorderSection } from '@/hooks/use-sections'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
  const navigate = useNavigate()

  const isStudent = currentAcademy?.user_role === 'student'

  const [createSectionDialogOpen, setCreateSectionDialogOpen] = useState(false)
  const [editSectionDialogOpen, setEditSectionDialogOpen] = useState(false)
  const [editLessonDialogOpen, setEditLessonDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [editingLesson, setEditingLesson] = useState<{
    lesson: Lesson
    sectionId: number
  } | null>(null)
  const [localSections, setLocalSections] = useState<Section[]>([])

  const { data: course, isLoading, error } = useCourse(courseSlug)
  const { data: sectionsData, isLoading: sectionsLoading } = useSections(
    academySlug,
    courseSlug
  )
  const reorderSection = useReorderSection(academySlug, courseSlug)

  const sections = Array.isArray(sectionsData) ? sectionsData : []

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
      setLocalSections(arrayMove(localSections, oldIndex, newIndex))
      reorderSection.mutate({ sectionId: active.id as number, position: newIndex + 1 })
    }
  }

  const handleCreateLesson = (sectionId: number) => {
    navigate({
      to: '/academy/$academySlug/courses/$courseSlug/lessons/new',
      params: { academySlug, courseSlug },
      search: { sectionId },
    })
  }

  const handleEditSection = (section: Section) => {
    setEditingSection(section)
    setEditSectionDialogOpen(true)
  }

  const handleEditLesson = (lesson: Lesson, sectionId: number) => {
    setEditingLesson({ lesson, sectionId })
    setEditLessonDialogOpen(true)
  }

  if (isLoading || sectionsLoading) {
    return (
      <div className='flex flex-col gap-4 p-6'>
        <Skeleton className='h-32 w-full rounded-2xl' />
        <div className='grid grid-cols-2 gap-3'>
          <Skeleton className='h-20 rounded-xl' />
          <Skeleton className='h-20 rounded-xl' />
        </div>
        <Skeleton className='h-48 w-full rounded-xl' />
        <Skeleton className='h-48 w-full rounded-xl' />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='p-6 text-center'>
        <h3 className='mb-2 text-lg font-bold text-red-500'>
          Error al cargar el curso
        </h3>
        <p className='text-muted-foreground'>
          No encontrado o sin permiso de acceso
        </p>
      </div>
    )
  }

  const lessonsCount = course.lessons_count ?? 0

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Header */}
      <div className='border-border/60 from-card via-card to-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6'>
        <div className='bg-primary/10 absolute top-0 right-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full blur-[80px]' />
        <div className='relative z-10 flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <Link
              to='/academy/$academySlug/courses/$courseSlug'
              params={{ academySlug, courseSlug }}
              className='text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors'
            >
              <ArrowLeft className='size-3.5' />
              Volver al curso
            </Link>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              {course.title}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Gestiona lecciones, secciones y contenido del curso
            </p>
          </div>
          {!isStudent && (
            <Button
              onClick={() => setCreateSectionDialogOpen(true)}
              className='bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
            >
              <Plus className='mr-2 size-4' />
              Nueva sección
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-2 gap-3'>
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='bg-primary/10 rounded-lg p-2'>
            <LayoutList className='text-primary size-4' />
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Secciones</p>
            <p className='text-foreground text-xl font-bold leading-none'>
              {sections.length}
            </p>
          </div>
        </div>
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='bg-emerald-500/10 rounded-lg p-2'>
            <BookOpen className='size-4 text-emerald-400' />
          </div>
          <div>
            <p className='text-muted-foreground text-xs'>Lecciones</p>
            <p className='text-foreground text-xl font-bold leading-none'>
              {lessonsCount}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {sections.length === 0 ? (
        <div className='border-border/40 bg-card/50 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center'>
          <div className='bg-primary/10 rounded-xl p-4'>
            <FolderOpen className='text-primary size-8' />
          </div>
          <div>
            {isStudent ? (
              <>
                <h3 className='font-semibold'>Aún no hay contenido disponible</h3>
                <p className='text-muted-foreground mx-auto mt-1 max-w-sm text-sm'>
                  El instructor está preparando el material. Vuelve pronto.
                </p>
              </>
            ) : (
              <>
                <h3 className='font-semibold'>Aún no hay secciones</h3>
                <p className='text-muted-foreground mx-auto mt-1 max-w-sm text-sm'>
                  Comienza a construir tu curso creando secciones y añadiendo lecciones
                </p>
              </>
            )}
          </div>
          {!isStudent && (
            <Button
              onClick={() => setCreateSectionDialogOpen(true)}
              variant='outline'
              className='mt-2'
            >
              <Plus className='mr-2 size-4' />
              Crear primera sección
            </Button>
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
            <div className='flex flex-col gap-4'>
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

