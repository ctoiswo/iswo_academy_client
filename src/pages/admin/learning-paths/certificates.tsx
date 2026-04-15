import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Award,
  ExternalLink,
  FileText,
  Save,
  Star,
} from 'lucide-react'
import { useCertificateTemplates } from '@/hooks/use-certificate-templates'
import {
  useLearningPathCertificateConfiguration,
  useUpdateLearningPathCertificateConfiguration,
  useLearningPathCertificates,
} from '@/hooks/use-certificates'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function LearningPathCertificates() {
  const { academySlug, learningPathSlug } = useParams({
    from: '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/certificates',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [certificateEnabled, setCertificateEnabled] = useState(false)
  const [selectedTemplateValue, setSelectedTemplateValue] = useState('default')

  const { data: certificateConfig, isLoading: isLoadingConfig } =
    useLearningPathCertificateConfiguration(academySlug, learningPathSlug)
  const { data: certificatesData, isLoading: isLoadingCertificates } =
    useLearningPathCertificates(academySlug, learningPathSlug, currentPage)
  const { data: templates, isLoading: isLoadingTemplates } =
    useCertificateTemplates(academySlug)
  const updateConfiguration = useUpdateLearningPathCertificateConfiguration(
    academySlug,
    learningPathSlug
  )

  useEffect(() => {
    if (!certificateConfig) return

    setCertificateEnabled(certificateConfig.certificate_enabled)
    setSelectedTemplateValue(
      certificateConfig.certificate_template?.id
        ? String(certificateConfig.certificate_template.id)
        : 'default'
    )
  }, [certificateConfig])

  const isLoading = isLoadingConfig || isLoadingTemplates
  const defaultTemplate =
    templates?.find((template) => template.is_default) || null
  const activeTemplates =
    templates?.filter((template) => template.is_active) || []
  const selectedTemplate = useMemo(() => {
    if (selectedTemplateValue === 'default') return defaultTemplate

    return (
      templates?.find(
        (template) => String(template.id) === selectedTemplateValue
      ) || null
    )
  }, [defaultTemplate, selectedTemplateValue, templates])
  const initialTemplateValue = certificateConfig?.certificate_template?.id
    ? String(certificateConfig.certificate_template.id)
    : 'default'
  const isDirty = certificateConfig
    ? certificateEnabled !== certificateConfig.certificate_enabled ||
      selectedTemplateValue !== initialTemplateValue
    : false

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (!certificateConfig) {
    return <div>Ruta de aprendizaje no encontrada</div>
  }

  const handleSave = async () => {
    await updateConfiguration.mutateAsync({
      certificateEnabled,
      certificateTemplateId:
        selectedTemplateValue === 'default'
          ? null
          : Number(selectedTemplateValue),
    })
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='border-border/60 from-card via-card to-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6'>
        <div className='bg-primary/10 absolute top-0 right-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full blur-[80px]' />
        <div className='relative z-10 flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <Link
              to='/academy/$academySlug/learning-paths/$learningPathSlug/info'
              params={{ academySlug, learningPathSlug }}
              className='text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors'
            >
              <ArrowLeft className='size-3.5' />
              Volver a la ruta
            </Link>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              {certificateConfig.learning_path.title}
            </h1>
            <p className='text-muted-foreground text-sm'>
              Selecciona la plantilla que usará esta ruta para emitir
              certificados
            </p>
          </div>
          <div className='flex shrink-0 gap-2'>
            <Link
              to='/academy/$academySlug/certificates'
              params={{ academySlug }}
            >
              <Button variant='outline'>
                <ExternalLink className='mr-2 h-4 w-4' />
                Gestionar Plantillas
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              disabled={!isDirty || updateConfiguration.isPending}
            >
              <Save className='mr-2 h-4 w-4' />
              Guardar
            </Button>
          </div>
        </div>
      </div>

      <div className='grid gap-3 md:grid-cols-3'>
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='bg-primary/10 rounded-lg p-2'>
            <Award className='text-primary size-4' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Emisión</p>
            <p className='text-foreground text-xl leading-none font-bold'>
              {certificateEnabled ? 'Activa' : 'Desactivada'}
            </p>
          </div>
        </div>
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='rounded-lg bg-amber-500/10 p-2'>
            <Star className='size-4 text-amber-400' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Plantilla</p>
            <p className='text-foreground text-xl leading-none font-bold'>
              {selectedTemplate?.name || 'Sin definir'}
            </p>
          </div>
        </div>
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='rounded-lg bg-emerald-500/10 p-2'>
            <FileText className='size-4 text-emerald-400' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Plantillas activas</p>
            <p className='text-foreground text-xl leading-none font-bold'>
              {activeTemplates.length}
            </p>
          </div>
        </div>
      </div>

      <div className='border-primary/20 bg-primary/5 flex items-start gap-3 rounded-xl border p-4'>
        <Award className='text-primary mt-0.5 size-4 shrink-0' />
        <div>
          <p className='text-primary text-sm font-semibold'>
            Asignación por ruta
          </p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            Las plantillas se gestionan a nivel academia. Aquí solo eliges cuál
            aplica a esta ruta de aprendizaje. Si no eliges una específica, se
            usará la predeterminada.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración del certificado</CardTitle>
          <CardDescription>
            Define si esta ruta emite certificados y qué plantilla debe usar.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center justify-between gap-6'>
            <div className='space-y-1'>
              <Label htmlFor='learning-path-certificate-enabled'>
                Emitir certificados
              </Label>
              <p className='text-muted-foreground text-sm'>
                Los estudiantes obtendrán un certificado al completar esta ruta.
              </p>
            </div>
            <Switch
              id='learning-path-certificate-enabled'
              checked={certificateEnabled}
              onCheckedChange={setCertificateEnabled}
            />
          </div>

          <div className='space-y-3'>
            <Label>Plantilla asignada</Label>
            <Select
              value={selectedTemplateValue}
              onValueChange={setSelectedTemplateValue}
              disabled={activeTemplates.length === 0}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Selecciona una plantilla' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='default'>
                  Usar plantilla predeterminada de la academia
                </SelectItem>
                {activeTemplates.map((template) => (
                  <SelectItem key={template.id} value={String(template.id)}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeTemplates.length === 0 && (
              <p className='text-muted-foreground text-sm'>
                No hay plantillas activas en esta academia todavía.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de la plantilla elegida</CardTitle>
          <CardDescription>
            Vista rápida de la configuración que se aplicará al emitir
            certificados de esta ruta.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {selectedTemplate ? (
            <>
              <div className='flex flex-wrap items-start justify-between gap-3 rounded-xl border p-4'>
                <div className='space-y-2'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <span className='text-base font-semibold'>
                      {selectedTemplate.name}
                    </span>
                    {selectedTemplate.is_default && (
                      <Badge variant='secondary'>Predeterminada</Badge>
                    )}
                    {selectedTemplate.is_active && (
                      <Badge variant='default'>Activa</Badge>
                    )}
                  </div>
                  <p className='text-muted-foreground max-w-2xl text-sm'>
                    {selectedTemplate.description ||
                      'Esta plantilla se utilizará para generar los certificados de la ruta.'}
                  </p>
                </div>
                <Link
                  to='/academy/$academySlug/certificates'
                  params={{ academySlug }}
                >
                  <Button variant='outline' size='sm'>
                    <ExternalLink className='mr-2 h-4 w-4' />
                    Ver plantillas
                  </Button>
                </Link>
              </div>

              <div className='grid gap-3 md:grid-cols-2'>
                <div className='rounded-xl border p-4'>
                  <p className='text-muted-foreground text-xs tracking-[0.2em] uppercase'>
                    Ruta
                  </p>
                  <p className='mt-2 text-sm font-medium'>
                    {certificateConfig.learning_path.title}
                  </p>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {certificateConfig.learning_path.courses_count} cursos
                    incluidos
                  </p>
                </div>
                <div className='rounded-xl border p-4'>
                  <p className='text-muted-foreground text-xs tracking-[0.2em] uppercase'>
                    Academia
                  </p>
                  <p className='mt-2 text-sm font-medium'>
                    {certificateConfig.academy.name}
                  </p>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    {certificateConfig.learning_path.estimated_duration_hours}{' '}
                    horas estimadas
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className='rounded-xl border-2 border-dashed p-8 text-center'>
              <FileText className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-foreground text-sm font-medium'>
                No hay una plantilla disponible todavía
              </p>
              <p className='text-muted-foreground mt-2 text-sm'>
                Crea o activa una plantilla a nivel academia para poder
                asignarla a esta ruta.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certificados Emitidos</CardTitle>
          <CardDescription>
            Lista de certificados emitidos para esta ruta (
            {certificatesData?.meta.total_count || 0})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingCertificates ? (
            <div className='space-y-2'>
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
              <Skeleton className='h-12 w-full' />
            </div>
          ) : certificatesData && certificatesData.data.length > 0 ? (
            <div className='space-y-4'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Número de Certificado</TableHead>
                    <TableHead>Fecha de Emisión</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificatesData.data.map((certificate) => (
                    <TableRow key={certificate.id}>
                      <TableCell>
                        <div>
                          <p className='font-medium'>
                            {certificate.user.full_name}
                          </p>
                          <p className='text-muted-foreground text-sm'>
                            {certificate.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className='font-mono text-sm'>
                        {certificate.certificate_number}
                      </TableCell>
                      <TableCell>
                        {format(new Date(certificate.issued_at), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {!certificate.revoked_at ? (
                          <Badge variant='default'>Activo</Badge>
                        ) : (
                          <Badge variant='destructive'>Revocado</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {certificate.verification_url && (
                          <Button variant='ghost' size='sm' asChild>
                            <a
                              href={certificate.verification_url}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              <ExternalLink className='mr-2 h-4 w-4' />
                              Verificar
                            </a>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {certificatesData.meta.total_pages > 1 && (
                <div className='flex items-center justify-between'>
                  <p className='text-muted-foreground text-sm'>
                    Página {certificatesData.meta.current_page} de{' '}
                    {certificatesData.meta.total_pages}
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={certificatesData.meta.current_page === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={
                        certificatesData.meta.current_page ===
                        certificatesData.meta.total_pages
                      }
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='py-12 text-center'>
              <Award className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-muted-foreground mb-4'>
                No se han emitido certificados aún
              </p>
              <p className='text-muted-foreground text-xs'>
                Los certificados se emitirán automáticamente cuando los
                estudiantes completen la ruta
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
