import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import type { Enrollment } from '@/types'
import {
  ArrowLeft,
  Users,
  Trash2,
  UserCheck,
  TrendingUp,
  Award,
} from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import {
  useCourseEnrollments,
  useDeleteEnrollment,
} from '@/hooks/use-course-enrollments'
import { useCourseBySlug } from '@/hooks/use-courses'
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

export default function CourseStudentsPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const { currentAcademy } = useAuthStore()
  const [deletingEnrollment, setDeletingEnrollment] =
    useState<Enrollment | null>(null)

  const academyId = currentAcademy?.id
  const {
    data: course,
    isLoading,
    error,
  } = useCourseBySlug(academyId ? Number(academyId) : 0, courseSlug)
  const { data: enrollments, isLoading: loadingEnrollments } =
    useCourseEnrollments(academySlug, courseSlug)
  const deleteEnrollment = useDeleteEnrollment(academySlug, courseSlug)

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
          <p className='text-gray-600'>
            Curso no encontrado o no tienes permiso para acceder
          </p>
          <Link
            to='/academy/$academySlug/admin/courses'
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

  const activeStudents =
    enrollments?.filter((e) => e.status === 'active').length || 0
  const completedStudents =
    enrollments?.filter((e) => e.status === 'completed').length || 0
  const avgProgress =
    enrollments && enrollments.length > 0
      ? enrollments.reduce((sum, e) => sum + (e.progress_percentage || 0), 0) /
        enrollments.length
      : 0

  const handleDelete = () => {
    if (deletingEnrollment) {
      deleteEnrollment.mutate(deletingEnrollment.id, {
        onSuccess: () => setDeletingEnrollment(null),
      })
    }
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <Link
          to='/academy/$academySlug/courses/$courseSlug'
          params={{ academySlug, courseSlug }}
        >
          <Button variant='ghost' size='sm' className='mb-2'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Volver al Curso
          </Button>
        </Link>
        <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
        <p className='text-gray-600'>
          Gestiona los estudiantes inscritos en este curso
        </p>
      </div>

      {/* Métricas */}
      <div className='mb-6 grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Estudiantes
            </CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{enrollments?.length || 0}</div>
            <p className='text-muted-foreground text-xs'>
              Inscritos en el curso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Activos</CardTitle>
            <UserCheck className='h-4 w-4 text-green-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activeStudents}</div>
            <p className='text-muted-foreground text-xs'>
              Cursando actualmente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Completados</CardTitle>
            <Award className='h-4 w-4 text-blue-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{completedStudents}</div>
            <p className='text-muted-foreground text-xs'>
              Finalizaron el curso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Progreso Promedio
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-purple-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{avgProgress.toFixed(0)}%</div>
            <p className='text-muted-foreground text-xs'>De avance general</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Estudiantes */}
      <Card>
        <CardHeader>
          <CardTitle>Estudiantes Inscritos</CardTitle>
          <CardDescription>
            Listado completo de estudiantes con su estado y progreso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingEnrollments ? (
            <div className='space-y-4'>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className='h-20' />
              ))}
            </div>
          ) : !enrollments || enrollments.length === 0 ? (
            <div className='py-12 text-center text-gray-500'>
              <Users className='mx-auto mb-4 h-12 w-12' />
              <h3 className='mb-2 text-lg font-medium'>
                No hay estudiantes inscritos
              </h3>
              <p className='mb-4'>
                Los estudiantes aparecerán aquí una vez se inscriban al curso
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {enrollments.map((enrollment) => (
                <Card key={enrollment.id}>
                  <CardContent className='pt-6'>
                    <div className='flex items-center justify-between'>
                      <div className='flex flex-1 items-center gap-4'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600'>
                          {enrollment.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex-1'>
                          <div className='mb-1 flex items-center gap-2'>
                            <p className='font-medium'>
                              {enrollment.user.name}
                            </p>
                            <Badge
                              variant={
                                enrollment.status === 'active'
                                  ? 'default'
                                  : enrollment.status === 'completed'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {enrollment.status === 'active'
                                ? 'Activo'
                                : enrollment.status === 'completed'
                                  ? 'Completado'
                                  : 'Suspendido'}
                            </Badge>
                          </div>
                          <p className='text-sm text-gray-600'>
                            {enrollment.user.email}
                          </p>
                          <div className='mt-2 flex items-center gap-4 text-xs text-gray-500'>
                            <span>
                              Inscrito:{' '}
                              {new Date(
                                enrollment.enrolled_at
                              ).toLocaleDateString()}
                            </span>
                            <span>
                              Progreso: {enrollment.progress_percentage || 0}%
                            </span>
                            {enrollment.completed_at && (
                              <span>
                                Completado:{' '}
                                {new Date(
                                  enrollment.completed_at
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setDeletingEnrollment(enrollment)}
                        className='text-red-600 hover:bg-red-50 hover:text-red-700'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog
        open={deletingEnrollment !== null}
        onOpenChange={(open) => !open && setDeletingEnrollment(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar estudiante?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar a{' '}
              <strong>{deletingEnrollment?.user.name}</strong> de este curso?
              Esta acción no se puede deshacer y el estudiante perderá todo su
              progreso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
