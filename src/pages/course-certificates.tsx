import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  Plus,
  Award,
  Eye,
  Trash2,
  Star,
  Settings,
  Layout,
  RotateCcw,
  FileText,
} from 'lucide-react'
import {
  useCertificateTemplates,
  useDeleteCertificateTemplate,
  useSetDefaultTemplate,
} from '@/hooks/use-certificate-templates'
import { useCourse } from '@/hooks/use-courses'
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
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CertificatePreviewDialog } from '@/components/certificates/certificate-preview-dialog'
import { CreateCertificateTemplateDialog } from '@/components/certificates/create-certificate-template-dialog'
import { EditCertificateTemplateDialog } from '@/components/certificates/edit-certificate-template-dialog'

export default function CourseCertificatesPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  )

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourse(courseSlug)
  const { data: templates, isLoading: templatesLoading } =
    useCertificateTemplates(academySlug)
  const deleteTemplate = useDeleteCertificateTemplate(academySlug)
  const setDefaultTemplate = useSetDefaultTemplate(academySlug)

  const isLoading = courseLoading || templatesLoading
  const error = courseError

  const handleDelete = (templateId: number) => {
    setSelectedTemplateId(templateId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (selectedTemplateId) {
      await deleteTemplate.mutateAsync(selectedTemplateId)
      setDeleteDialogOpen(false)
      setSelectedTemplateId(null)
    }
  }

  const handleSetDefault = async (templateId: number) => {
    await setDefaultTemplate.mutateAsync(templateId)
  }

  const handlePreview = (templateId: number) => {
    setSelectedTemplateId(templateId)
    setPreviewDialogOpen(true)
  }

  const handleEdit = (templateId: number) => {
    setSelectedTemplateId(templateId)
    setEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className='space-y-4 p-6'>
        <Skeleton className='h-32 w-full rounded-2xl' />
        <div className='grid grid-cols-3 gap-3'>
          <Skeleton className='h-20 rounded-xl' />
          <Skeleton className='h-20 rounded-xl' />
          <Skeleton className='h-20 rounded-xl' />
        </div>
        <Skeleton className='h-48 rounded-xl' />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='p-6 text-center'>
        <h3 className='mb-2 text-lg font-bold text-red-500'>Error al cargar el curso</h3>
        <p className='text-muted-foreground mb-4'>No encontrado o sin permiso de acceso</p>
        <Link to='/academy/$academySlug/admin/courses' params={{ academySlug }}>
          <Button variant='outline'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver a Cursos
          </Button>
        </Link>
      </div>
    )
  }

  const defaultTemplate = templates?.find((t) => t.is_default)
  const otherTemplates = templates?.filter((t) => !t.is_default) || []
  const totalTemplates = templates?.length ?? 0
  const activeCount = templates?.filter((t) => t.is_active).length ?? 0

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
              Configura las plantillas de certificados de finalización
            </p>
          </div>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className='bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
          >
            <Plus className='mr-2 h-4 w-4' />
            Nueva Plantilla
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-3 gap-3'>
        {/* Total */}
        <div className='border-border/60 bg-card group relative flex items-center gap-3 rounded-xl border p-4'>
          <div className='bg-primary/10 rounded-lg p-2'>
            <Award className='text-primary size-4' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Total</p>
            <p className='text-foreground text-xl font-bold leading-none'>{totalTemplates}</p>
          </div>
        </div>
        {/* Default */}
        <div className='border-border/60 bg-card group relative flex items-center gap-3 rounded-xl border p-4'>
          <div className='rounded-lg bg-amber-500/10 p-2'>
            <Star className='size-4 text-amber-400' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Predeterminada</p>
            <p className='text-foreground text-xl font-bold leading-none'>
              {defaultTemplate ? '1' : '0'}
            </p>
          </div>
        </div>
        {/* Active */}
        <div className='border-border/60 bg-card group relative flex items-center gap-3 rounded-xl border p-4'>
          <div className='rounded-lg bg-emerald-500/10 p-2'>
            <FileText className='size-4 text-emerald-400' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Activas</p>
            <p className='text-foreground text-xl font-bold leading-none'>{activeCount}</p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className='border-primary/20 bg-primary/5 flex items-start gap-3 rounded-xl border p-4'>
        <Award className='text-primary mt-0.5 size-4 shrink-0' />
        <div>
          <p className='text-primary text-sm font-semibold'>Acerca de los certificados</p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            Se generan automáticamente al completar el curso. Usa{' '}
            <span className='font-mono'>{'{{student_name}}'}</span> y{' '}
            <span className='font-mono'>{'{{course_title}}'}</span> como datos dinámicos.
            Tamaño recomendado: A4 o Letter en orientación landscape.
          </p>
        </div>
      </div>

      {/* Default Template */}
      {defaultTemplate && (
        <div className='flex flex-col gap-3'>
          <p className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
            <Star className='size-4 fill-amber-400 text-amber-400' />
            Plantilla predeterminada
          </p>
          <div className='border-amber-500/30 bg-card rounded-xl border p-5'>
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <span className='text-base font-semibold'>{defaultTemplate.name}</span>
                  <span className='rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400'>
                    Predeterminada
                  </span>
                  {defaultTemplate.is_active && (
                    <span className='rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400'>
                      Activa
                    </span>
                  )}
                </div>
                {defaultTemplate.description && (
                  <p className='text-muted-foreground text-sm'>{defaultTemplate.description}</p>
                )}
              </div>
              <div className='flex shrink-0 gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePreview(defaultTemplate.id)}
                >
                  <Eye className='mr-1.5 h-3.5 w-3.5' />
                  Vista Previa
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleEdit(defaultTemplate.id)}
                >
                  <Settings className='mr-1.5 h-3.5 w-3.5' />
                  Configurar
                </Button>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
              <div className='bg-muted/40 rounded-lg p-3'>
                <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
                  <Layout className='size-3' />
                  Orientación
                </div>
                <p className='text-sm font-semibold capitalize'>{defaultTemplate.design.layout}</p>
              </div>
              <div className='bg-muted/40 rounded-lg p-3'>
                <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
                  <FileText className='size-3' />
                  Borde
                </div>
                <p className='text-sm font-semibold capitalize'>{defaultTemplate.design.border_style}</p>
              </div>
              <div className='bg-muted/40 rounded-lg p-3'>
                <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
                  <Settings className='size-3' />
                  Firmas
                </div>
                <p className='text-sm font-semibold'>{defaultTemplate.design.signature_count}</p>
              </div>
              <div className='bg-muted/40 rounded-lg p-3'>
                <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
                  <RotateCcw className='size-3' />
                  Usos
                </div>
                <p className='text-sm font-semibold'>{defaultTemplate.usage_count}</p>
              </div>
            </div>
            {defaultTemplate.requirements &&
              (defaultTemplate.requirements.lessons_completion ||
                defaultTemplate.requirements.minimum_score) && (
                <div className='border-border/40 mt-3 rounded-lg border p-3'>
                  <p className='text-muted-foreground mb-1.5 text-xs font-medium'>Requisitos</p>
                  <div className='flex flex-wrap gap-3 text-sm'>
                    {defaultTemplate.requirements.lessons_completion && (
                      <span className='text-muted-foreground'>
                        Completar{' '}
                        <span className='text-foreground font-semibold'>
                          {defaultTemplate.requirements.lessons_completion}%
                        </span>{' '}
                        de las lecciones
                      </span>
                    )}
                    {defaultTemplate.requirements.minimum_score && (
                      <span className='text-muted-foreground'>
                        Puntaje mínimo{' '}
                        <span className='text-foreground font-semibold'>
                          {defaultTemplate.requirements.minimum_score}%
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      )}

      {/* Other Templates */}
      {otherTemplates.length > 0 && (
        <div className='flex flex-col gap-3'>
          <p className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
            <FileText className='size-4' />
            Otras plantillas
          </p>
          <div className='grid gap-4 md:grid-cols-2'>
            {otherTemplates.map((template) => (
              <div
                key={template.id}
                className='border-border/60 bg-card rounded-xl border p-4'
              >
                <div className='mb-3 flex items-start justify-between gap-3'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='flex items-center gap-2'>
                      <span className='font-semibold'>{template.name}</span>
                      {template.is_active && (
                        <span className='rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400'>
                          Activa
                        </span>
                      )}
                    </div>
                    {template.description && (
                      <p className='text-muted-foreground text-xs'>{template.description}</p>
                    )}
                  </div>
                </div>
                <div className='mb-3 grid grid-cols-2 gap-2'>
                  <div className='bg-muted/40 rounded-lg p-2.5'>
                    <p className='text-muted-foreground text-xs'>Orientación</p>
                    <p className='text-sm font-semibold capitalize'>{template.design.layout}</p>
                  </div>
                  <div className='bg-muted/40 rounded-lg p-2.5'>
                    <p className='text-muted-foreground text-xs'>Usos</p>
                    <p className='text-sm font-semibold'>{template.usage_count}</p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePreview(template.id)}
                    className='flex-1'
                  >
                    <Eye className='mr-1 h-3.5 w-3.5' />
                    Vista Previa
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleSetDefault(template.id)}
                    className='flex-1'
                  >
                    <Star className='mr-1 h-3.5 w-3.5' />
                    Predeterminar
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleEdit(template.id)}
                  >
                    <Settings className='h-3.5 w-3.5' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleDelete(template.id)}
                    className='text-destructive hover:text-destructive'
                  >
                    <Trash2 className='h-3.5 w-3.5' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalTemplates === 0 && (
        <div className='border-border/40 bg-card/50 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center'>
          <div className='bg-primary/10 rounded-xl p-4'>
            <Award className='text-primary size-8' />
          </div>
          <div>
            <h3 className='font-semibold'>Aún no hay plantillas</h3>
            <p className='text-muted-foreground mx-auto mt-1 max-w-sm text-sm'>
              Crea tu primera plantilla de certificado para que los estudiantes puedan obtenerlos
              al completar el curso
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className='mt-2'>
            <Plus className='mr-2 h-4 w-4' />
            Crear Primera Plantilla
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <CreateCertificateTemplateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        academySlug={academySlug}
      />

      {selectedTemplateId && (
        <>
          <EditCertificateTemplateDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            academySlug={academySlug}
            templateId={selectedTemplateId}
          />

          <CertificatePreviewDialog
            open={previewDialogOpen}
            onOpenChange={setPreviewDialogOpen}
            academySlug={academySlug}
            templateId={selectedTemplateId}
          />
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Los certificados ya emitidos con
              esta plantilla no se verán afectados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className='bg-destructive hover:bg-destructive/90'
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
