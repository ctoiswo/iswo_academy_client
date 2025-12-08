import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { Download, Search, Trash2 } from 'lucide-react'
import {
  useLearningPathEnrollments,
  useDeleteLearningPathEnrollment,
} from '@/hooks/use-learning-path-enrollments'
import { useLearningPath } from '@/hooks/use-learning-paths'
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
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function LearningPathStudents() {
  const { academySlug, learningPathSlug } = useParams({
    from: '/_authenticated/academy/$academySlug/learning-paths/$learningPathSlug/students',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, _setStatusFilter] = useState<'active' | 'completed' | 'suspended' | undefined>(
    undefined
  )
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<number | null>(
    null
  )

  const { data: learningPath, isLoading: isLoadingPath } = useLearningPath(
    academySlug,
    learningPathSlug
  )
  const { data: enrollmentsData, isLoading: isLoadingEnrollments } =
    useLearningPathEnrollments(academySlug, learningPathSlug, {
      status: statusFilter,
    })
  const deleteEnrollment = useDeleteLearningPathEnrollment(
    academySlug,
    learningPathSlug
  )

  const handleDeleteEnrollment = async () => {
    if (!enrollmentToDelete) return

    deleteEnrollment.mutate(enrollmentToDelete, {
      onSuccess: () => {
        setEnrollmentToDelete(null)
      },
    })
  }

  const isLoading = isLoadingPath || isLoadingEnrollments

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-96 w-full' />
      </div>
    )
  }

  if (!learningPath) {
    return <div>Ruta de aprendizaje no encontrada</div>
  }

  const enrollments = enrollmentsData?.data || []

  // Filter by search term
  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalEnrolled = enrollments.length
  const inProgress = enrollments.filter((e) => e.status === 'active').length
  const completed = enrollments.filter((e) => e.status === 'completed').length
  const completionRate =
    totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Estudiantes Inscritos</h1>
          <p className='text-muted-foreground'>
            Gestiona y monitorea el progreso de los estudiantes
          </p>
        </div>
        <Button>
          <Download className='mr-2 h-4 w-4' />
          Exportar CSV
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Total Inscritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{totalEnrolled}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              En Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{inProgress}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Completados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{completed}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-muted-foreground text-sm font-medium'>
              Tasa de Completado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-3xl font-bold'>{completionRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Lista de Estudiantes</CardTitle>
              <CardDescription>
                Estudiantes inscritos en esta ruta de aprendizaje
              </CardDescription>
            </div>
            <div className='relative w-72'>
              <Search className='text-muted-foreground absolute top-2.5 left-2 h-4 w-4' />
              <Input
                placeholder='Buscar estudiantes...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fecha de Inscripción</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Cursos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className='w-[100px]'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments.map((enrollment) => (
                <TableRow key={enrollment.id}>
                  <TableCell className='font-medium'>
                    {enrollment.user.name}
                  </TableCell>
                  <TableCell>{enrollment.user.email}</TableCell>
                  <TableCell>
                    {new Date(enrollment.enrolled_at).toLocaleDateString(
                      'es-ES'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className='space-y-1'>
                      <Progress
                        value={enrollment.progress_percentage}
                        className='w-24'
                      />
                      <span className='text-muted-foreground text-xs'>
                        {enrollment.progress_percentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {enrollment.completed_courses}/{enrollment.total_courses}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        enrollment.status === 'completed'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {enrollment.status === 'completed'
                        ? 'Completado'
                        : 'En Progreso'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setEnrollmentToDelete(enrollment.id)}
                    >
                      <Trash2 className='text-destructive h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredEnrollments.length === 0 && (
            <div className='py-12 text-center'>
              <p className='text-muted-foreground'>
                {searchTerm
                  ? 'No se encontraron estudiantes con ese criterio de búsqueda'
                  : 'No hay estudiantes inscritos en esta ruta'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={enrollmentToDelete !== null}
        onOpenChange={(open) => !open && setEnrollmentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la inscripción del
              estudiante de esta ruta de aprendizaje. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEnrollment}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
