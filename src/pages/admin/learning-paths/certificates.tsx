import { useState } from 'react'
import { format } from 'date-fns'
import { useParams } from '@tanstack/react-router'
import { Award, FileText, ExternalLink } from 'lucide-react'
import {
  useLearningPathCertificateConfiguration,
  useUpdateLearningPathCertificateConfiguration,
  useLearningPathCertificates,
} from '@/hooks/use-certificates'
import { useLearningPath } from '@/hooks/use-learning-paths'
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

  const { data: learningPath, isLoading: isLoadingPath } = useLearningPath(
    academySlug,
    learningPathSlug
  )
  const { data: certificateConfig, isLoading: isLoadingConfig } =
    useLearningPathCertificateConfiguration(academySlug, learningPathSlug)
  const { data: certificatesData, isLoading: isLoadingCertificates } =
    useLearningPathCertificates(academySlug, learningPathSlug, currentPage)
  const updateConfiguration = useUpdateLearningPathCertificateConfiguration(
    academySlug,
    learningPathSlug
  )

  const isLoading = isLoadingPath || isLoadingConfig

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (!learningPath || !certificateConfig) {
    return <div>Ruta de aprendizaje no encontrada</div>
  }

  const handleToggleCertificates = (enabled: boolean) => {
    updateConfiguration.mutate(enabled)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Certificados</h1>
        <p className='text-muted-foreground'>
          Configura los certificados para estudiantes que completen esta ruta
        </p>
      </div>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Emitidos
            </CardTitle>
            <Award className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {certificateConfig.statistics.total_issued}
            </div>
            <p className='text-muted-foreground text-xs'>
              certificados en total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Certificados Activos
            </CardTitle>
            <Award className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {certificateConfig.statistics.active_certificates}
            </div>
            <p className='text-muted-foreground text-xs'>vigentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Certificados Revocados
            </CardTitle>
            <Award className='h-4 w-4 text-red-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {certificateConfig.statistics.revoked_certificates}
            </div>
            <p className='text-muted-foreground text-xs'>anulados</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emisión de Certificados</CardTitle>
          <CardDescription>
            Activa esta opción para emitir certificados automáticamente
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label
                htmlFor='enable_certificates'
                className='flex items-center gap-2'
              >
                <Award className='h-4 w-4' />
                Emitir Certificados
              </Label>
              <p className='text-muted-foreground text-sm'>
                Los estudiantes recibirán un certificado al completar todos los
                cursos
              </p>
            </div>
            <Switch
              id='enable_certificates'
              checked={certificateConfig.certificate_enabled}
              onCheckedChange={handleToggleCertificates}
              disabled={updateConfiguration.isPending}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plantilla del Certificado</CardTitle>
          <CardDescription>
            {certificateConfig.certificate_template
              ? `Usando plantilla: ${certificateConfig.certificate_template.name}`
              : 'No hay plantilla configurada'}
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {certificateConfig.certificate_template ? (
            <>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2'>
                    <FileText className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>
                      {certificateConfig.certificate_template.name}
                    </span>
                    {certificateConfig.certificate_template.is_default && (
                      <Badge variant='secondary'>Por defecto</Badge>
                    )}
                    {certificateConfig.certificate_template.is_active && (
                      <Badge variant='default'>Activa</Badge>
                    )}
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    Esta plantilla se usará para generar los certificados
                  </p>
                </div>
                <Button variant='outline' size='sm'>
                  <ExternalLink className='mr-2 h-4 w-4' />
                  Ver Plantilla
                </Button>
              </div>

              <div className='space-y-2'>
                <Label>Información del Certificado</Label>
                <div className='text-muted-foreground space-y-1 text-sm'>
                  <p>
                    • Título: Certificado de Completado -{' '}
                    {certificateConfig.learning_path.title}
                  </p>
                  <p>• Academia: {certificateConfig.academy.name}</p>
                  <p>
                    • Duración Total:{' '}
                    {certificateConfig.learning_path.estimated_duration_hours}{' '}
                    horas
                  </p>
                  <p>
                    • Cursos Incluidos:{' '}
                    {certificateConfig.learning_path.courses_count}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className='rounded-lg border-2 border-dashed p-8 text-center'>
              <FileText className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-muted-foreground mb-4 text-sm'>
                No hay plantilla de certificado configurada
              </p>
              <p className='text-muted-foreground mb-4 text-xs'>
                Contacta al administrador de la academia para configurar una
                plantilla
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
