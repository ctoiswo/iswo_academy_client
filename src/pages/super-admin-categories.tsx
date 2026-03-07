import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import academyCategoryService from '@/services/academy-category-service'
import type {
  AcademyCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types'
import {
  LayoutGrid,
  List,
  Plus,
  Search,
  Building2,
  Edit,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'

type ViewMode = 'grid' | 'list'

interface PaginationMeta {
  current_page: number
  total_pages: number
  total_count: number
  per_page: number
}

interface CategoryFormData {
  name: string
  description: string
  slug: string
}

export default function SuperAdminCategories() {
  const { user } = useAuthStore()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [categories, setCategories] = useState<AcademyCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
    per_page: 15,
  })

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] =
    useState<AcademyCategory | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
  })
  const [formLoading, setFormLoading] = useState(false)

  const loadCategories = useCallback(
    async (page: number = 1, search: string = '') => {
      try {
        setLoading(true)
        const result = await academyCategoryService.getAllCategories({
          page,
          per_page: 15,
          search: search || undefined,
        })
        setCategories(result.data)
        setPagination(result.meta)
        setCurrentPage(page)
      } catch (_error) {
        // console.error('Error loading categories:', error)
        toast.error('No se pudieron cargar las categorías')
      } finally {
        setLoading(false)
      }
    },
    [toast]
  )

  useEffect(() => {
    loadCategories(1, searchQuery)
  }, [searchQuery, loadCategories])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchInput])

  const handleSearch = (value: string) => {
    setSearchInput(value)
  }

  const handlePageChange = (page: number) => {
    loadCategories(page, searchQuery)
  }

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const openCreateDialog = () => {
    setFormData({ name: '', description: '', slug: '' })
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (category: AcademyCategory) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug || '',
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (category: AcademyCategory) => {
    setSelectedCategory(category)
    setIsDeleteDialogOpen(true)
  }

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    try {
      setFormLoading(true)
      const data: CreateCategoryRequest = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
      }
      await academyCategoryService.createCategory(data)
      toast.success('Categoría creada correctamente')
      setIsCreateDialogOpen(false)
      loadCategories(currentPage, searchQuery)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'No se pudo crear la categoría'
      )
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedCategory || !formData.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    try {
      setFormLoading(true)
      const data: UpdateCategoryRequest = {
        name: formData.name,
        description: formData.description,
        slug: formData.slug,
      }
      await academyCategoryService.updateCategory(selectedCategory.id, data)
      toast.success('Categoría actualizada correctamente')
      setIsEditDialogOpen(false)
      loadCategories(currentPage, searchQuery)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'No se pudo actualizar la categoría'
      )
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCategory) return

    try {
      setFormLoading(true)
      await academyCategoryService.deleteCategory(selectedCategory.id)
      toast.success('Categoría eliminada correctamente')
      setIsDeleteDialogOpen(false)
      loadCategories(currentPage, searchQuery)
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'No se pudo eliminar la categoría'
      )
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <DashboardLayout
      user={user}
      academy={null}
      variant='full'
      dashboardType='super-admin'
      title='Categorías de Academias'
      subtitle='Gestiona las categorías de todas las academias'
    >
      <div className='space-y-6'>
      {/* Filters and View Toggle */}
      <div className='flex flex-col items-stretch gap-4 sm:flex-row sm:items-center'>
        <div className='relative flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
          <Input
            placeholder='Buscar categorías...'
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            className='pl-10'
          />
        </div>
        <div className='flex items-center self-start rounded-lg border'>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size='sm'
            onClick={() => setViewMode('grid')}
            className='rounded-r-none'
          >
            <LayoutGrid className='h-4 w-4' />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size='sm'
            onClick={() => setViewMode('list')}
            className='rounded-l-none'
          >
            <List className='h-4 w-4' />
          </Button>
        </div>
        <Button onClick={openCreateDialog} className='self-start'>
          <Plus className='mr-2 h-4 w-4' />
          Nueva Categoría
        </Button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className='py-12 text-center'>
          <p className='text-muted-foreground'>Cargando categorías...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className='py-12 text-center'>
          <p className='text-muted-foreground'>
            {searchQuery
              ? 'No se encontraron categorías'
              : 'No hay categorías disponibles'}
          </p>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && categories.length > 0 && (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {categories.map((category) => (
            <Card
              key={category.id}
              className='transition-shadow hover:shadow-lg'
            >
              <CardHeader className='space-y-0 pb-4'>
                <div className='flex items-start justify-between'>
                  <div className='space-y-1'>
                    <CardTitle className='text-lg'>{category.name}</CardTitle>
                    <CardDescription className='text-xs'>
                      {category.slug}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className='mr-2 h-4 w-4' />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(category)}
                        className='text-destructive'
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-muted-foreground line-clamp-3 text-sm'>
                  {category.description || 'Sin descripción'}
                </p>
              </CardContent>
              <CardFooter className='text-sm'>
                <div className='flex items-center gap-1.5'>
                  <Building2 className='text-muted-foreground h-4 w-4' />
                  <span>{category.academies_count || 0} academias</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === 'list' && categories.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Academias</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className='font-medium'>{category.name}</TableCell>
                  <TableCell>
                    <Badge variant='outline'>{category.slug}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className='text-muted-foreground line-clamp-2 max-w-md text-sm'>
                      {category.description || 'Sin descripción'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-1.5'>
                      <Building2 className='text-muted-foreground h-4 w-4' />
                      {category.academies_count || 0}
                    </div>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='h-8 w-8'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className='mr-2 h-4 w-4' />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(category)}
                          className='text-destructive'
                        >
                          <Trash2 className='mr-2 h-4 w-4' />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {!loading && categories.length > 0 && pagination.total_pages > 1 && (
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div className='text-muted-foreground text-sm'>
            Mostrando {(pagination.current_page - 1) * pagination.per_page + 1}{' '}
            a{' '}
            {Math.min(
              pagination.current_page * pagination.per_page,
              pagination.total_count
            )}{' '}
            de {pagination.total_count} categorías
          </div>
          <div className='flex flex-wrap items-center justify-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4' />
              Anterior
            </Button>
            <div className='flex items-center gap-1'>
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                .filter((page) => {
                  return (
                    page === 1 ||
                    page === pagination.total_pages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                })
                .map((page, index, array) => {
                  const showEllipsisBefore =
                    index > 0 && page - array[index - 1] > 1
                  return (
                    <div key={page} className='flex items-center gap-1'>
                      {showEllipsisBefore && (
                        <span className='text-muted-foreground px-2'>...</span>
                      )}
                      <Button
                        variant={currentPage === page ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => handlePageChange(page)}
                        className='w-10'
                      >
                        {page}
                      </Button>
                    </div>
                  )
                })}
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_pages}
            >
              Siguiente
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onOpenChange={() => {
          setIsCreateDialogOpen(false)
          setIsEditDialogOpen(false)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isCreateDialogOpen ? 'Nueva Categoría' : 'Editar Categoría'}
            </DialogTitle>
            <DialogDescription>
              {isCreateDialogOpen
                ? 'Crea una nueva categoría para las academias'
                : 'Modifica los datos de la categoría'}
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Nombre</Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder='Ej: Tecnología, Negocios, Arte...'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='slug'>Slug</Label>
              <Input
                id='slug'
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder='Generado automáticamente'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='description'>Descripción</Label>
              <Textarea
                id='description'
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Describe esta categoría...'
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsCreateDialogOpen(false)
                setIsEditDialogOpen(false)
              }}
              disabled={formLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={isCreateDialogOpen ? handleCreate : handleUpdate}
              disabled={formLoading}
            >
              {formLoading
                ? 'Guardando...'
                : isCreateDialogOpen
                  ? 'Crear'
                  : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar categoría?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la categoría "
              {selectedCategory?.name}"? Esta acción no se puede deshacer.
              {selectedCategory && selectedCategory.academies_count > 0 && (
                <span className='text-destructive mt-2 block font-medium'>
                  ⚠️ Esta categoría tiene {selectedCategory.academies_count}{' '}
                  academias asociadas.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={formLoading}
            >
              Cancelar
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              disabled={formLoading}
            >
              {formLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  )
}
