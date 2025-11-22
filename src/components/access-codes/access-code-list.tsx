import { useState } from 'react'
import { type AccessCodeFilters } from '@/services/access-code-service'
import { Plus, Key, Filter } from 'lucide-react'
import { useAccessCodes } from '@/hooks/use-access-codes'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { AccessCodeCard } from './access-code-card'
import { CreateAccessCodeDialog } from './create-access-code-dialog'

interface AccessCodeListProps {
  courseSlug: number | string
}

export function AccessCodeList({ courseSlug }: AccessCodeListProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [filters, setFilters] = useState<AccessCodeFilters>({})

  const {
    data: accessCodesData,
    isLoading,
    error,
  } = useAccessCodes(courseSlug, filters)

  const handleFilterChange = (status: string) => {
    setFilters({
      ...filters,
      status: status === 'all' ? undefined : (status as any),
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Códigos de Acceso</CardTitle>
              <CardDescription>
                Genera códigos de acceso para permitir inscripción gratuita en
                este curso
              </CardDescription>
            </div>
            <Skeleton className='h-10 w-32' />
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Skeleton className='h-32' />
          <Skeleton className='h-32' />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className='py-12 text-center'>
          <p className='text-red-600'>Error al cargar los códigos de acceso</p>
        </CardContent>
      </Card>
    )
  }

  // Handle different response structures
  console.log('AccessCodesData received:', accessCodesData)
  const accessCodes = Array.isArray(accessCodesData)
    ? accessCodesData
    : accessCodesData?.data || []
  console.log('Processed accessCodes:', accessCodes)

  return (
    <>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Códigos de Acceso</CardTitle>
              <CardDescription>
                Genera códigos de acceso para permitir inscripción gratuita en
                este curso
              </CardDescription>
            </div>
            {accessCodes.length !== 0 && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Crear Código de Acceso
              </Button>
            )}
          </div>

          {/* Filters */}
          {accessCodes.length > 0 && (
            <div className='flex items-center gap-2 pt-4'>
              <Filter className='text-muted-foreground h-4 w-4' />
              <Select
                value={filters.status || 'all'}
                onValueChange={handleFilterChange}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Filtrar por estado' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Todos los estados</SelectItem>
                  <SelectItem value='active'>Activo</SelectItem>
                  <SelectItem value='inactive'>Inactivo</SelectItem>
                  <SelectItem value='expired'>Expirado</SelectItem>
                  <SelectItem value='exhausted'>Agotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {accessCodes.length === 0 ? (
            <div className='py-12 text-center text-gray-500'>
              <Key className='mx-auto mb-4 h-12 w-12' />
              <h3 className='mb-2 text-lg font-medium'>
                Aún no hay códigos de acceso
              </h3>
              <p className='mb-4'>
                Crea códigos de acceso para dar acceso gratuito a los
                estudiantes a este curso
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className='mr-2 h-4 w-4' />
                Crear Primer Código de Acceso
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {accessCodes.map((accessCode: any) => (
                <AccessCodeCard
                  key={accessCode.id}
                  accessCode={accessCode}
                  courseSlug={courseSlug}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create dialog */}
      <CreateAccessCodeDialog
        courseSlug={courseSlug}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </>
  )
}
