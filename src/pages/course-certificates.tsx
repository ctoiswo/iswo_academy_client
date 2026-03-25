import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  ArrowLeft,
  Award,
  Star,
  FileText,
  Save,
} from 'lucide-react'
import { useCertificateTemplates } from '@/hooks/use-certificate-templates'
import { useCourse, useUpdateCourse } from '@/hooks/use-courses'
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

export default function CourseCertificatesPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params

  const [certificateEnabled, setCertificateEnabled] = useState(false)
  const [selectedTemplateValue, setSelectedTemplateValue] = useState('default')

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourse(courseSlug, academySlug)
  const { data: templates, isLoading: templatesLoading } =
    useCertificateTemplates(academySlug)
  const updateCourse = useUpdateCourse(academySlug)

  const isLoading = courseLoading || templatesLoading
  const error = courseError

  const defaultTemplate = templates?.find((template) => template.is_default) || null
  const activeTemplates = templates?.filter((template) => template.is_active) || []
  const selectedTemplate = useMemo(() => {
    if (selectedTemplateValue === 'default') return defaultTemplate
    return (
      templates?.find((template) => String(template.id) === selectedTemplateValue) ||
      null
    )
  }, [defaultTemplate, selectedTemplateValue, templates])

  useEffect(() => {
    if (!course) return

    setCertificateEnabled(course.certificate_enabled)
    setSelectedTemplateValue(
      course.certificate_template?.id
        ? String(course.certificate_template.id)
        : 'default'
    )
  }, [course])

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

  const isDirty =
    certificateEnabled !== course.certificate_enabled ||
    selectedTemplateValue !==
      (course.certificate_template?.id
        ? String(course.certificate_template.id)
        : 'default')

  const handleSave = async () => {
    await updateCourse.mutateAsync({
      courseSlug,
      data: {
        certificate_enabled: certificateEnabled,
        certificate_template_id:
          selectedTemplateValue === 'default'
            ? null
            : Number(selectedTemplateValue),
      },
    })
  }

  return (
    <div className='flex flex-col gap-6 p-6'>
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
              Selecciona la plantilla que usará este curso para emitir certificados
            </p>
          </div>
          <div className='flex shrink-0 gap-2'>
            <Button onClick={handleSave} disabled={!isDirty || updateCourse.isPending}>
              <Save className='mr-2 h-4 w-4' />
              Guardar
            </Button>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-3'>
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='bg-primary/10 rounded-lg p-2'>
            <Award className='text-primary size-4' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>Emisión</p>
            <p className='text-foreground text-xl font-bold leading-none'>
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
            <p className='text-foreground text-xl font-bold leading-none'>
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
            <p className='text-foreground text-xl font-bold leading-none'>
              {activeTemplates.length}
            </p>
          </div>
        </div>
      </div>

      <div className='border-primary/20 bg-primary/5 flex items-start gap-3 rounded-xl border p-4'>
        <Award className='text-primary mt-0.5 size-4 shrink-0' />
        <div>
          <p className='text-primary text-sm font-semibold'>Asignación por curso</p>
          <p className='text-muted-foreground mt-0.5 text-xs'>
            Las plantillas se diseñan fuera del curso, a nivel academia. Aquí solo eliges
            cuál aplica a este curso. Si no eliges una específica, se usará la predeterminada.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración del certificado</CardTitle>
          <CardDescription>
            Define si este curso emite certificados y qué plantilla debe usar.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center justify-between gap-6'>
            <div className='space-y-1'>
              <Label htmlFor='course-certificate-enabled'>Emitir certificados</Label>
              <p className='text-muted-foreground text-sm'>
                Los estudiantes obtendrán un certificado al completar este curso.
              </p>
            </div>
            <Switch
              id='course-certificate-enabled'
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
                <SelectItem value='default'>Usar plantilla predeterminada de la academia</SelectItem>
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
            Vista rápida de la plantilla que se aplicará cuando se genere el certificado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedTemplate ? (
            <div className='space-y-4 rounded-xl border p-4'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='text-base font-semibold'>{selectedTemplate.name}</span>
                    {selectedTemplate.is_default && (
                      <Badge variant='secondary'>Predeterminada</Badge>
                    )}
                    {selectedTemplate.is_active && <Badge>Activa</Badge>}
                  </div>
                  {selectedTemplate.description && (
                    <p className='text-muted-foreground mt-1 text-sm'>
                      {selectedTemplate.description}
                    </p>
                  )}
                </div>

              </div>

              <div className='grid gap-3 md:grid-cols-3'>
                <div className='bg-muted/40 rounded-lg p-3'>
                  <p className='text-muted-foreground text-xs'>Orientación</p>
                  <p className='text-sm font-semibold capitalize'>
                    {selectedTemplate.design.layout}
                  </p>
                </div>
                <div className='bg-muted/40 rounded-lg p-3'>
                  <p className='text-muted-foreground text-xs'>Borde</p>
                  <p className='text-sm font-semibold capitalize'>
                    {selectedTemplate.design.border_style}
                  </p>
                </div>
                <div className='bg-muted/40 rounded-lg p-3'>
                  <p className='text-muted-foreground text-xs'>Usos</p>
                  <p className='text-sm font-semibold'>{selectedTemplate.usage_count}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className='rounded-xl border border-dashed p-8 text-center'>
              <Award className='text-muted-foreground mx-auto mb-3 size-10' />
              <p className='font-medium'>No hay plantilla disponible</p>
              <p className='text-muted-foreground mt-1 text-sm'>
                Crea una plantilla en la biblioteca de la academia y luego vuelve aquí para asignarla.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
