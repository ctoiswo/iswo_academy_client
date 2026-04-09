import { useEffect, useMemo } from 'react'
import { useParams, useSearch } from '@tanstack/react-router'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { Award, CheckCircle2, Download, ScrollText, XCircle } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { certificateService } from '@/services/certificate-service'
import { enrollmentService } from '@/services/enrollment-service'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Certificate, CourseCertificateStatus, Enrollment } from '@/types'

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'
const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '')

function formatMetricValue(
  value: number | string | null | undefined,
  unit?: string
) {
  if (value == null || value === '') return 'Sin datos'
  if (typeof value === 'number') {
    return `${Number.isInteger(value) ? value : value.toFixed(2)}${unit ?? ''}`
  }
  return `${value}${unit ?? ''}`
}

function resolveApiUrl(url?: string | null) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`
}

function CertificateStatusCard({
  status,
  description,
}: {
  status: CourseCertificateStatus
  description: string
}) {
  return (
    <Card
      className={status.has_certificate
        ? 'border-emerald-500/30 bg-emerald-500/5'
        : 'border-amber-500/30 bg-amber-500/5'}
    >
      <CardContent className='space-y-3 p-5'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <p className='text-sm font-semibold'>
              {status.course.title}
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>
              {description}
            </p>
          </div>

          {status.has_certificate ? (
            <div className='flex items-center gap-2 text-emerald-600'>
              <CheckCircle2 className='size-4' />
              <span className='text-xs font-medium'>Disponible</span>
            </div>
          ) : (
            <div className='flex items-center gap-2 text-amber-600'>
              <XCircle className='size-4' />
              <span className='text-xs font-medium'>Pendiente</span>
            </div>
          )}
        </div>

        <div className='grid gap-3 sm:grid-cols-3'>
          <div className='bg-background/70 rounded-lg border p-3'>
            <p className='text-muted-foreground text-[11px] uppercase tracking-wide'>
              Progreso actual
            </p>
            <p className='mt-1 text-sm font-semibold'>
              {formatMetricValue(status.metrics.progress_percentage, '%')}
            </p>
          </div>
          <div className='bg-background/70 rounded-lg border p-3'>
            <p className='text-muted-foreground text-[11px] uppercase tracking-wide'>
              Calificacion actual
            </p>
            <p className='mt-1 text-sm font-semibold'>
              {formatMetricValue(status.metrics.current_score, '%')}
            </p>
          </div>
          <div className='bg-background/70 rounded-lg border p-3'>
            <p className='text-muted-foreground text-[11px] uppercase tracking-wide'>
              Estado del curso
            </p>
            <p className='mt-1 text-sm font-semibold'>
              {status.metrics.completed ? 'Completado' : 'En progreso'}
            </p>
          </div>
        </div>

        {status.has_certificate && status.certificate && (
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant='outline' className='text-xs'>
              #{status.certificate.certificate_number}
            </Badge>
            <Button
              size='sm'
              className='gap-2'
              onClick={() => {
                const target =
                  resolveApiUrl(status.certificate?.pdf_url) ||
                  resolveApiUrl(status.certificate?.download_path)

                if (!target) return
                window.open(target, '_blank', 'noopener,noreferrer')
              }}
            >
              <Download className='size-4' />
              Descargar certificado
            </Button>
          </div>
        )}

        {!status.has_certificate && status.missing_requirements.length > 0 && (
          <div className='space-y-2'>
            <p className='text-xs font-medium'>Te falta completar:</p>
            <div className='space-y-2'>
              {status.missing_requirements.map((requirement) => (
                <div key={requirement.key} className='bg-background/60 rounded-lg border p-3'>
                  <p className='text-sm font-medium'>{requirement.label}</p>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {requirement.message}
                  </p>
                  {(requirement.current != null || requirement.required != null) && (
                    <p className='text-muted-foreground mt-2 text-xs'>
                      Actual: {formatMetricValue(requirement.current, requirement.unit)}
                      {' · '}
                      Requerido: {formatMetricValue(requirement.required, requirement.unit)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function MyCertificatesPage() {
  const { user, currentAcademy } = useAuthStore()
  const queryClient = useQueryClient()
  const { academySlug } = useParams({ strict: false }) as {
    academySlug?: string
  }
  const search = useSearch({ strict: false }) as {
    courseSlug?: string
    from?: string
  }

  const { data, isLoading } = useQuery({
    queryKey: ['my-certificates', academySlug],
    queryFn: () => certificateService.getCertificates({ per_page: 100 }),
    enabled: !!academySlug,
  })

  const { data: courseCertificateStatus, isLoading: isLoadingCourseStatus } = useQuery({
    queryKey: ['course-certificate-status', academySlug, search.courseSlug],
    queryFn: () =>
      certificateService.getCourseCertificateStatus(academySlug!, search.courseSlug!),
    enabled: !!academySlug && !!search.courseSlug,
  })

  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['certificate-pending-enrollments', academySlug],
    queryFn: () => enrollmentService.getUserEnrollments({ academy_slug: academySlug, per_page: 100 }),
    enabled: !!academySlug,
  })

  const academyEnrollments = useMemo(() => {
    const raw = enrollmentsData as { enrollments?: Enrollment[] } | undefined
    return raw?.enrollments ?? []
  }, [enrollmentsData])

  const { pendingStatuses, isAnyPendingLoading, hasFreshCertificate } = useQueries({
    queries: academyEnrollments.map((enrollment) => ({
      queryKey: ['course-certificate-status', academySlug, enrollment.course.slug, 'pending-list'],
      queryFn: () =>
        certificateService.getCourseCertificateStatus(academySlug!, enrollment.course.slug),
      enabled: !!academySlug && !!enrollment.course.slug,
    })),
    combine: (results) => ({
      pendingStatuses: results
        .map((r) => r.data)
        .filter((s): s is CourseCertificateStatus => Boolean(s)),
      isAnyPendingLoading: results.some((r) => r.isLoading),
      hasFreshCertificate: results.some((r) => Boolean(r.data?.has_certificate)),
    }),
  })

  const certificates: Certificate[] = useMemo(() => {
    const raw = data as any
    const list = raw?.data || raw?.certificates || []

    if (!academySlug) return list

    return list.filter((certificate: Certificate) => {
      const certificateAcademySlug = certificate.course?.academy_slug

      if (certificateAcademySlug) {
        return certificateAcademySlug === academySlug
      }

      if (
        currentAcademy?.slug === academySlug &&
        currentAcademy?.name &&
        certificate.course?.academy_name
      ) {
        return certificate.course.academy_name === currentAcademy.name
      }

      return false
    })
  }, [data, academySlug, currentAcademy?.name, currentAcademy?.slug])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const automaticPendingStatuses = useMemo(() => {
    return pendingStatuses
      .filter((status) => !status.has_certificate)
      .filter((status) => status.metrics.current_score != null)
      .filter((status) => status.course.slug !== search.courseSlug)
  }, [pendingStatuses, search.courseSlug])

  const isLoadingPendingStatuses = isLoadingEnrollments || isAnyPendingLoading

  useEffect(() => {
    if (!hasFreshCertificate || !academySlug) return

    queryClient.invalidateQueries({ queryKey: ['my-certificates', academySlug] })
  }, [academySlug, hasFreshCertificate, queryClient])

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='student'
    >
      <div className='space-y-6'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-bold'>
            <ScrollText className='text-primary size-6' />
            Mis Certificados
          </h1>
          <p className='text-muted-foreground mt-1 text-sm'>
            Certificados que has ganado en esta academia
          </p>
        </div>

        {search.courseSlug && !isLoadingCourseStatus && courseCertificateStatus && (
          <CertificateStatusCard
            status={courseCertificateStatus}
            description={courseCertificateStatus.has_certificate
              ? 'Tu certificado ya esta disponible.'
              : search.from === 'final-exam'
                ? 'Aprobaste el examen final. Revisa los requisitos pendientes para habilitar tu certificado.'
                : 'Revisa el estado de tu certificado para este curso.'}
          />
        )}

        {!search.courseSlug && !isLoadingPendingStatuses && automaticPendingStatuses.length > 0 && (
          <div className='space-y-3'>
            <div>
              <h2 className='text-lg font-semibold'>Pendientes</h2>
              <p className='text-muted-foreground text-sm'>
                Cursos donde ya aprobaste el examen final pero aun faltan requisitos para emitir el certificado.
              </p>
            </div>
            <div className='space-y-4'>
              {automaticPendingStatuses.map((status) => (
                <CertificateStatusCard
                  key={status.course.slug}
                  status={status}
                  description='Aprobaste el examen final. Revisa lo que falta para habilitar tu certificado.'
                />
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='h-40 rounded-xl' />
            ))}
          </div>
        )}

        {!isLoading && !isLoadingPendingStatuses && certificates.length === 0 && automaticPendingStatuses.length === 0 && (!search.courseSlug || !courseCertificateStatus) && (
          <div className='border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center'>
            <Award className='text-muted-foreground/40 size-14' />
            <p className='text-muted-foreground mt-4 text-base font-medium'>
              Aun no tienes certificados
            </p>
            <p className='text-muted-foreground mt-1 text-sm'>
              Completa cursos para obtener tus certificados de finalizacion
            </p>
          </div>
        )}

        {!isLoading && certificates.length > 0 && (
          <>
            <p className='text-muted-foreground text-sm'>
              {certificates.length}{' '}
              {certificates.length === 1
                ? 'certificado ganado'
                : 'certificados ganados'}
            </p>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {certificates.map((certificate) => (
                <Card
                  key={certificate.id}
                  className='bg-gradient-to-br from-emerald-500/5 to-cyan-500/5'
                >
                  <CardContent className='flex h-full flex-col gap-3 p-5'>
                    <div className='flex items-start justify-between gap-2'>
                      <div className='bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full'>
                        <ScrollText className='size-5' />
                      </div>
                      <Badge variant='outline' className='text-xs'>
                        #{certificate.certificate_number}
                      </Badge>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm font-semibold leading-tight'>
                        {certificate.course.title}
                      </p>
                      <p className='text-muted-foreground text-xs'>
                        {certificate.course.academy_name}
                      </p>
                    </div>

                    <p className='text-muted-foreground text-xs'>
                      Emitido el {formatDate(certificate.issued_at)}
                    </p>

                    <div className='mt-auto'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='w-full'
                        onClick={() => {
                          const target =
                            resolveApiUrl(certificate.pdf_url) ||
                            resolveApiUrl(certificate.verification_url)
                          if (!target) return

                          window.open(target, '_blank', 'noopener,noreferrer')
                        }}
                        disabled={!certificate.pdf_url && !certificate.verification_url}
                      >
                        Ver certificado
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
