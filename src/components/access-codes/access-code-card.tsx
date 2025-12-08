import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { type AccessCode } from '@/services/access-code-service'
import { es } from 'date-fns/locale'
import {
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  useDeleteAccessCode,
  useToggleAccessCodeStatus,
} from '@/hooks/use-access-codes'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'

interface AccessCodeCardProps {
  accessCode: AccessCode
  courseSlug: number | string
}

export function AccessCodeCard({
  accessCode,
  courseSlug,
}: AccessCodeCardProps) {
  const [showCode, setShowCode] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const deleteAccessCode = useDeleteAccessCode(courseSlug)
  const toggleStatus = useToggleAccessCodeStatus(courseSlug)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(accessCode.code)
      toast.success('Código copiado al portapapeles')
    } catch (_error) {
      toast.error('Error al copiar el código')
    }
  }

  const handleToggleStatus = () => {
    toggleStatus.mutate(accessCode.id)
  }

  const handleDelete = () => {
    deleteAccessCode.mutate(accessCode.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false)
      },
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant='default' className='bg-green-100 text-green-800'>
            <CheckCircle className='mr-1 h-3 w-3' />
            Activo
          </Badge>
        )
      case 'inactive':
        return (
          <Badge variant='secondary'>
            <Ban className='mr-1 h-3 w-3' />
            Inactivo
          </Badge>
        )
      case 'expired':
        return (
          <Badge variant='destructive'>
            <Clock className='mr-1 h-3 w-3' />
            Expirado
          </Badge>
        )
      case 'exhausted':
        return (
          <Badge variant='destructive'>
            <XCircle className='mr-1 h-3 w-3' />
            Agotado
          </Badge>
        )
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const getExpiryText = () => {
    if (accessCode.expired) {
      return 'Expirado'
    }

    if (accessCode.days_until_expiry <= 0) {
      return 'Expira hoy'
    }

    if (accessCode.days_until_expiry === 1) {
      return 'Expira mañana'
    }

    return `Expira en ${accessCode.days_until_expiry} días`
  }

  return (
    <>
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='space-y-1'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <div className='flex items-center gap-2'>
                  {showCode ? (
                    <code className='rounded bg-gray-100 px-2 py-1 font-mono text-sm'>
                      {accessCode.code}
                    </code>
                  ) : (
                    <code className='rounded bg-gray-100 px-2 py-1 font-mono text-sm'>
                      {'•'.repeat(8)}
                    </code>
                  )}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setShowCode(!showCode)}
                  >
                    {showCode ? (
                      <EyeOff className='h-4 w-4' />
                    ) : (
                      <Eye className='h-4 w-4' />
                    )}
                  </Button>
                  <Button variant='ghost' size='sm' onClick={copyCode}>
                    <Copy className='h-4 w-4' />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {accessCode.description || 'Sin descripción'}
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              {getStatusBadge(accessCode.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Abrir menú</span>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                  <DropdownMenuItem onClick={copyCode}>
                    <Copy className='mr-2 h-4 w-4' />
                    Copiar código
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleToggleStatus}
                    disabled={toggleStatus.isPending}
                  >
                    {accessCode.status === 'active' ? (
                      <>
                        <Ban className='mr-2 h-4 w-4' />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <CheckCircle className='mr-2 h-4 w-4' />
                        Activar
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className='text-red-600'
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <XCircle className='mr-2 h-4 w-4' />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Usage Progress */}
          <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
              <span className='text-muted-foreground'>Uso</span>
              <span>
                {accessCode.usage_count} / {accessCode.usage_limit}
              </span>
            </div>
            <Progress value={accessCode.usage_percentage} className='h-2' />
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-blue-600' />
              <div>
                <p className='font-medium'>{accessCode.remaining_uses}</p>
                <p className='text-muted-foreground'>Usos restantes</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4 text-orange-600' />
              <div>
                <p className='font-medium'>{getExpiryText()}</p>
                <p className='text-muted-foreground'>Estado de expiración</p>
              </div>
            </div>
          </div>

          {/* Enrollments */}
          <div className='border-t pt-2'>
            <div className='text-muted-foreground flex justify-between text-sm'>
              <span>
                Inscripciones totales: {accessCode.statistics.total_enrollments}
              </span>
              <span>Activas: {accessCode.statistics.active_enrollments}</span>
            </div>
          </div>

          {/* Created info */}
          <div className='text-muted-foreground border-t pt-2 text-xs'>
            Creado por {accessCode.created_by.full_name} •{' '}
            {formatDistanceToNow(new Date(accessCode.created_at), {
              addSuffix: true,
              locale: es,
            })}
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el código de acceso "{accessCode.code}". Los estudiantes que ya
              usaron este código mantendrán su inscripción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteAccessCode.isPending}
              className='bg-red-600 hover:bg-red-700'
            >
              {deleteAccessCode.isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
