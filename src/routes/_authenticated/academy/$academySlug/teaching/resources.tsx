import { createFileRoute } from '@tanstack/react-router'
import { FolderOpen } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

function TeachingResourcesPage() {
  const { user, currentAcademy } = useAuthStore()
  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='teacher'
      title='Recursos'
      subtitle='Materiales y recursos de tus cursos'
    >
      <div className='text-muted-foreground flex flex-col items-center gap-3 py-16'>
        <FolderOpen className='h-12 w-12' />
        <p className='text-lg font-medium'>Recursos — Próximamente</p>
        <p className='text-sm'>
          Esta sección estará disponible en una próxima actualización.
        </p>
      </div>
    </DashboardLayout>
  )
}

export const Route = createFileRoute(
  '/_authenticated/academy/$academySlug/teaching/resources'
)({
  component: TeachingResourcesPage,
})
