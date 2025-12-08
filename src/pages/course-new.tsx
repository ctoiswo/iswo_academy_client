import { useNavigate, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { CourseForm } from '@/components/courses'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function CourseNewPage() {
  const navigate = useNavigate()
  const { academySlug } = useParams({ strict: false }) as {
    academySlug: string
  }
  const { user, currentAcademy } = useAuthStore()

  const handleSuccess = () => {
    navigate({
      to: '/academy/$academySlug/admin/courses',
      params: { academySlug },
    })
  }

  const handleCancel = () => {
    navigate({
      to: '/academy/$academySlug/admin/courses',
      params: { academySlug },
    })
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      dashboardType='academy-admin'
    >
      <div className='container pb-8'>
        {/* Header */}
        <div className='mb-8'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleCancel}
            className='mb-4'
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver a Cursos
          </Button>
          <h1 className='text-3xl font-bold tracking-tight'>
            Crear Nuevo Curso
          </h1>
          <p className='text-muted-foreground mt-2'>
            Completa la información para crear un nuevo curso en tu academia
          </p>
        </div>

        {/* Form */}
        <div className='max-w-4xl'>
          <CourseForm
            academySlug={academySlug}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
