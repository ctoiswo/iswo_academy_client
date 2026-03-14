import { BookOpen } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { CoursesManagementView } from '@/features/dashboard/admin/components'

export default function CoursesManagementPage() {
  const { user, currentAcademy } = useAuthStore()

  // No academy selected
  if (!currentAcademy || !user) {
    return (
      <DashboardLayout
        user={user}
        academy={currentAcademy}
        variant='full'
        dashboardType='academy-admin'
      >
        <div className='py-12 text-center'>
          <BookOpen className='mx-auto mb-4 h-12 w-12 text-muted-foreground' />
          <h3 className='mb-2 text-lg font-medium text-foreground'>
            No hay Academia Seleccionada
          </h3>
          <p className='text-muted-foreground'>
            Por favor selecciona una academia para gestionar cursos
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='academy-admin'
    >
      <CoursesManagementView academy={currentAcademy} />
    </DashboardLayout>
  )
}
