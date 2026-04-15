import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import {
  Plus,
  Award,
  FileDown,
  Trash2,
  Star,
  Settings,
  Layout,
  RotateCcw,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useCertificateTemplates,
  useDeleteCertificateTemplate,
  useGenerateTemplatePreviewPdf,
  useSetDefaultTemplate,
} from '@/hooks/use-certificate-templates'
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
import { CreateCertificateTemplateDialog } from '@/components/certificates/create-certificate-template-dialog'
import { EditCertificateTemplateDialog } from '@/components/certificates/edit-certificate-template-dialog'

export default function CertificateTemplatesPage() {
  const { academySlug } = useParams({ strict: false }) as {
    academySlug: string
  }

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  )

  const {
    data: templates,
    isLoading,
    refetch,
  } = useCertificateTemplates(academySlug)
  const deleteTemplate = useDeleteCertificateTemplate(academySlug)
  const setDefaultTemplate = useSetDefaultTemplate(academySlug)
  const generatePreviewPdf = useGenerateTemplatePreviewPdf(academySlug)

  const handleDelete = (templateId: number) => {
    setSelectedTemplateId(templateId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedTemplateId) return

    await deleteTemplate.mutateAsync(selectedTemplateId)
    setDeleteDialogOpen(false)
    setSelectedTemplateId(null)
  }

  const handleSetDefault = async (templateId: number) => {
    await setDefaultTemplate.mutateAsync(templateId)
  }

  const resolveDownloadUrl = (url?: string | null) => {
    if (!url) return null
    if (url.startsWith('http://') || url.startsWith('https://')) return url

    const apiBaseUrl =
      import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
    const baseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '')

    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
  }

  const openPreviewPdf = (url?: string | null) => {
    const resolvedUrl = resolveDownloadUrl(url)
    if (!resolvedUrl) return false

    window.open(resolvedUrl, '_blank', 'noopener,noreferrer')
    return true
  }

  const waitForPreviewPdf = async (
    templateId: number,
    previousPreviewUrl?: string | null,
    previousUpdatedAt?: string
  ) => {
    for (let attempt = 0; attempt < 15; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const latest = await refetch()
      const updatedTemplate = latest.data?.find(
        (item) => item.id === templateId
      )

      const previewChanged =
        !!updatedTemplate?.preview_pdf_url &&
        updatedTemplate.preview_pdf_url !== previousPreviewUrl
      const timestampChanged =
        !!updatedTemplate?.preview_pdf_url &&
        !!updatedTemplate.updated_at &&
        updatedTemplate.updated_at !== previousUpdatedAt

      if (previewChanged || timestampChanged) {
        openPreviewPdf(updatedTemplate.preview_pdf_url)
        toast.success('PDF de prueba generado y abierto en una nueva pestaña')
        return
      }
    }

    toast.info(
      'El PDF sigue generándose. Actualiza en unos segundos y usa el botón de descarga.'
    )
  }

  const handleGeneratePreviewPdf = async (templateId: number) => {
    const template = templates?.find((item) => item.id === templateId)

    await generatePreviewPdf.mutateAsync(templateId)
    await waitForPreviewPdf(
      templateId,
      template?.preview_pdf_url,
      template?.updated_at
    )
  }

  const handleEdit = (templateId: number) => {
    setSelectedTemplateId(templateId)
    setEditDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-72' />
            <Skeleton className='h-4 w-96' />
          </div>
          <Skeleton className='h-10 w-40' />
        </div>
        <div className='grid gap-3 md:grid-cols-3'>
          <Skeleton className='h-20 rounded-xl' />
          <Skeleton className='h-20 rounded-xl' />
          <Skeleton className='h-20 rounded-xl' />
        </div>
        <Skeleton className='h-48 rounded-xl' />
      </div>
    )
  }

  const defaultTemplate = templates?.find((template) => template.is_default)
  const otherTemplates =
    templates?.filter((template) => !template.is_default) || []
  const totalTemplates = templates?.length ?? 0
  const activeCount =
    templates?.filter((template) => template.is_active).length ?? 0

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>Plantillas de Certificados</h1>
          <p className='text-muted-foreground'>
            Crea y reutiliza plantillas para cursos y rutas de aprendizaje
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Nueva Plantilla
        </Button>
      </div>

      <div className='grid gap-3 md:grid-cols-3'>
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='bg-primary/10 rounded-lg p-2'>
            <Award className='text-primary size-4' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Total</p>
            <p className='text-foreground text-xl leading-none font-bold'>
              {totalTemplates}
            </p>
          </div>
        </div>
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='rounded-lg bg-amber-500/10 p-2'>
            <Star className='size-4 text-amber-400' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Predeterminada</p>
            <p className='text-foreground text-xl leading-none font-bold'>
              {defaultTemplate ? '1' : '0'}
            </p>
          </div>
        </div>
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='rounded-lg bg-emerald-500/10 p-2'>
            <FileText className='size-4 text-emerald-400' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Activas</p>
            <p className='text-foreground text-xl leading-none font-bold'>
              {activeCount}
            </p>
          </div>
        </div>
      </div>

      <div className='border-primary/20 bg-primary/5 flex items-start gap-3 rounded-xl border p-4'>
        <Award className='text-primary mt-0.5 size-4 shrink-0' />
        <div>
          <p className='text-primary text-sm font-semibold'>
            Biblioteca reutilizable
          </p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            Diseña la plantilla una sola vez y luego asígnala a cursos o rutas.
            Usa <span className='font-mono'>{'{{student_name}}'}</span> y{' '}
            <span className='font-mono'>{'{{course_title}}'}</span> como datos
            dinámicos.
          </p>
        </div>
      </div>

      {defaultTemplate && (
        <div className='flex flex-col gap-3'>
          <p className='text-muted-foreground flex items-center gap-2 text-sm font-medium'>
            <Star className='size-4 fill-amber-400 text-amber-400' />
            Plantilla predeterminada
          </p>
          <div className='bg-card rounded-xl border border-amber-500/30 p-5'>
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div className='flex flex-col gap-1'>
                <div className='flex items-center gap-2'>
                  <span className='text-base font-semibold'>
                    {defaultTemplate.name}
                  </span>
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
                  <p className='text-muted-foreground text-sm'>
                    {defaultTemplate.description}
                  </p>
                )}
              </div>
              <div className='flex shrink-0 gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleGeneratePreviewPdf(defaultTemplate.id)}
                  disabled={generatePreviewPdf.isPending}
                >
                  <FileDown className='mr-1.5 h-3.5 w-3.5' />
                  {defaultTemplate.preview_pdf_url
                    ? 'Regenerar PDF'
                    : 'Generar PDF'}
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
            <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-4'>
              <div className='bg-muted/40 rounded-lg p-3'>
                <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
                  <Layout className='size-3' />
                  Orientación
                </div>
                <p className='text-sm font-semibold capitalize'>
                  {defaultTemplate.design.layout}
                </p>
              </div>
              <div className='bg-muted/40 rounded-lg p-3'>
                <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
                  <FileText className='size-3' />
                  Borde
                </div>
                <p className='text-sm font-semibold capitalize'>
                  {defaultTemplate.design.border_style}
                </p>
              </div>
              <div className='bg-muted/40 rounded-lg p-3'>
                <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
                  <Settings className='size-3' />
                  Firmas
                </div>
                <p className='text-sm font-semibold'>
                  {defaultTemplate.design.signature_count}
                </p>
              </div>
              <div className='bg-muted/40 rounded-lg p-3'>
                <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
                  <RotateCcw className='size-3' />
                  Usos
                </div>
                <p className='text-sm font-semibold'>
                  {defaultTemplate.usage_count}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                      <p className='text-muted-foreground text-xs'>
                        {template.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className='mb-3 grid grid-cols-2 gap-2'>
                  <div className='bg-muted/40 rounded-lg p-2.5'>
                    <p className='text-muted-foreground text-xs'>Orientación</p>
                    <p className='text-sm font-semibold capitalize'>
                      {template.design.layout}
                    </p>
                  </div>
                  <div className='bg-muted/40 rounded-lg p-2.5'>
                    <p className='text-muted-foreground text-xs'>Usos</p>
                    <p className='text-sm font-semibold'>
                      {template.usage_count}
                    </p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleGeneratePreviewPdf(template.id)}
                    disabled={generatePreviewPdf.isPending}
                    className='flex-1'
                  >
                    <FileDown className='mr-1 h-3.5 w-3.5' />
                    {template.preview_pdf_url ? 'Regenerar PDF' : 'Generar PDF'}
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

      {totalTemplates === 0 && (
        <div className='border-border/40 bg-card/50 flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center'>
          <div className='bg-primary/10 rounded-xl p-4'>
            <Award className='text-primary size-8' />
          </div>
          <div>
            <h3 className='font-semibold'>Aún no hay plantillas</h3>
            <p className='text-muted-foreground mx-auto mt-1 max-w-sm text-sm'>
              Crea tu primera plantilla para reutilizarla en cursos y rutas de
              aprendizaje.
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className='mt-2'>
            <Plus className='mr-2 h-4 w-4' />
            Crear Primera Plantilla
          </Button>
        </div>
      )}

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
