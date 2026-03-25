import { useMemo } from 'react'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Award, ScrollText } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { certificateService } from '@/services/certificate-service'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { Certificate } from '@/types'

export default function MyCertificatesPage() {
  const { user, currentAcademy } = useAuthStore()
  const { academySlug } = useParams({ strict: false }) as {
    academySlug?: string
  }

  const { data, isLoading } = useQuery({
    queryKey: ['my-certificates', academySlug],
    queryFn: () => certificateService.getCertificates({ per_page: 100 }),
    enabled: !!academySlug,
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

        {isLoading && (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className='h-40 rounded-xl' />
            ))}
          </div>
        )}

        {!isLoading && certificates.length === 0 && (
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
                      <Button variant='outline' size='sm' className='w-full' disabled>
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
