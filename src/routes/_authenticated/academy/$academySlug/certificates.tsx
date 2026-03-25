import { createFileRoute } from '@tanstack/react-router'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import CertificateTemplatesPage from '@/pages/certificate-templates'
import MyCertificatesPage from '@/pages/my-certificates'
import { useAuthStore } from '@/stores/auth-store'

function AcademyCertificatesRouteComponent() {
  const { user, currentAcademy } = useAuthStore()

  const content =
    currentAcademy?.user_role && currentAcademy.user_role !== 'student' ? (
      <CertificateTemplatesPage />
    ) : (
      <MyCertificatesPage />
    )

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='academy-admin'
    >
      {content}
    </DashboardLayout>
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/certificates'
)({
  component: AcademyCertificatesRouteComponent,
})
