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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
          <p className='text-muted-foreground'>
            Curso no encontrado o no tienes permiso para acceder
          </p>
          <Link
            to='/academy/$academySlug/courses'
            params={{ academySlug }}
            className='mt-4 inline-block'
          >
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver a Cursos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const defaultTemplate = templates?.find((t) => t.is_default)
  const otherTemplates = templates?.filter((t) => !t.is_default) || []

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <Link
          to='/academy/$academySlug/courses/$courseSlug'
          params={{ academySlug, courseSlug }}
        >
          <Button variant='ghost' size='sm' className='mb-4'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver al Curso
          </Button>
        </Link>
        <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
        <p className='text-muted-foreground'>
          Configura las plantillas de certificados de finalización
        </p>
      </div>

      {/* Info Card */}
      <Card className='mb-6 border-blue-200 bg-blue-50'>
        <CardContent className='pt-6'>
          <div className='flex items-start gap-3'>
            <Award className='mt-0.5 h-5 w-5 text-blue-600' />
            <div>
              <h3 className='mb-1 font-semibold text-blue-900'>
                Acerca de los Certificados
              </h3>
              <p className='mb-2 text-sm text-blue-800'>
                Los certificados se generan automáticamente cuando los
                estudiantes completan el curso según los requisitos
                establecidos.
              </p>
              <ul className='list-inside list-disc space-y-1 text-sm text-blue-700'>
                <li>
                  Tamaño recomendado: A4 (210 x 297mm) o Letter (216 x 279mm)
                </li>
                <li>
                  Formato: Orientación horizontal (landscape) o vertical
                  (portrait)
                </li>
                <li>El fondo blanco permite mejor impresión y visualización</li>
                <li>
                  Usa placeholders como {'{{student_name}}'} o{' '}
                  {'{{course_title}}'} para datos dinámicos
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>Plantillas de Certificados</h2>
          <p className='text-muted-foreground text-sm'>
            {templates?.length || 0}{' '}
            {templates?.length === 1 ? 'plantilla' : 'plantillas'} configuradas
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Nueva Plantilla
        </Button>
      </div>

      {/* Default Template */}
      {defaultTemplate && (
        <div className='mb-6'>
          <h3 className='text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium'>
            <Star className='h-4 w-4 fill-yellow-500 text-yellow-500' />
            Plantilla Predeterminada
          </h3>
          <Card>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-1 flex items-center gap-2'>
                    <CardTitle className='text-lg'>
                      {defaultTemplate.name}
                    </CardTitle>
                    <Badge variant='default' className='bg-yellow-500'>
                      Predeterminada
                    </Badge>
                    {defaultTemplate.is_active && (
                      <Badge variant='outline'>Activa</Badge>
                    )}
                  </div>
                  <CardDescription>
                    {defaultTemplate.description || 'Sin descripción'}
                  </CardDescription>
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handlePreview(defaultTemplate.id)}
                  >
                    <Eye className='mr-2 h-4 w-4' />
                    Vista Previa
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleEdit(defaultTemplate.id)}
                  >
                    <Settings className='mr-2 h-4 w-4' />
                    Configurar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                <div>
                  <span className='text-muted-foreground'>Orientación:</span>
                  <p className='font-medium capitalize'>
                    {defaultTemplate.design.layout}
                  </p>
                </div>
                <div>
                  <span className='text-muted-foreground'>
                    Estilo de Borde:
                  </span>
                  <p className='font-medium capitalize'>
                    {defaultTemplate.design.border_style}
                  </p>
                </div>
                <div>
                  <span className='text-muted-foreground'>Firmas:</span>
                  <p className='font-medium'>
                    {defaultTemplate.design.signature_count}
                  </p>
                </div>
                <div>
                  <span className='text-muted-foreground'>Usos:</span>
                  <p className='font-medium'>{defaultTemplate.usage_count}</p>
                </div>
              </div>
              {defaultTemplate.requirements &&
                Object.keys(defaultTemplate.requirements).length > 0 && (
                  <div className='mt-4 rounded-lg bg-gray-50 p-3'>
                    <p className='text-muted-foreground mb-2 text-sm font-medium'>
                      Requisitos:
                    </p>
                    <ul className='text-muted-foreground space-y-1 text-sm'>
                      {defaultTemplate.requirements.lessons_completion && (
                        <li>
                          • Completar{' '}
                          {defaultTemplate.requirements.lessons_completion}% de
                          las lecciones
                        </li>
                      )}
                      {defaultTemplate.requirements.minimum_score && (
                        <li>
                          • Puntaje mínimo:{' '}
                          {defaultTemplate.requirements.minimum_score}%
                        </li>
                      )}
                    </ul>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Other Templates */}
      {otherTemplates.length > 0 && (
        <div>
          <h3 className='text-muted-foreground mb-3 flex items-center gap-2 text-sm font-medium'>
            <FileText className='h-4 w-4' />
            Otras Plantillas
          </h3>
          <div className='grid gap-4 md:grid-cols-2'>
            {otherTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-1 flex items-center gap-2'>
                        <CardTitle className='text-base'>
                          {template.name}
                        </CardTitle>
                        {template.is_active && (
                          <Badge variant='outline'>Activa</Badge>
                        )}
                      </div>
                      <CardDescription className='text-xs'>
                        {template.description || 'Sin descripción'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='mb-3 grid grid-cols-2 gap-3 text-xs'>
                    <div>
                      <span className='text-muted-foreground'>
                        Orientación:
                      </span>
                      <p className='font-medium capitalize'>
                        {template.design.layout}
                      </p>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Usos:</span>
                      <p className='font-medium'>{template.usage_count}</p>
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handlePreview(template.id)}
                      className='flex-1'
                    >
                      <Eye className='mr-1 h-3 w-3' />
                      Vista Previa
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleSetDefault(template.id)}
                      className='flex-1'
                    >
                      <Star className='mr-1 h-3 w-3' />
                      Predeterminar
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEdit(template.id)}
                    >
                      <Settings className='h-3 w-3' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDelete(template.id)}
                      className='text-red-600 hover:text-red-700'
                    >
                      <Trash2 className='h-3 w-3' />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!templates || templates.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <Award className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <h3 className='mb-2 text-lg font-medium'>
              No hay plantillas configuradas
            </h3>
            <p className='text-muted-foreground mb-4'>
              Crea tu primera plantilla de certificado para que los estudiantes
              puedan obtenerlos al completar el curso
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className='mr-2 h-4 w-4' />
              Crear Primera Plantilla
            </Button>
          </CardContent>
        </Card>
      ) : null}

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
              className='bg-red-600 hover:bg-red-700'
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
