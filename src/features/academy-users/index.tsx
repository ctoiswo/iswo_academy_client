import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import academyAdminService, {
  type AcademyUserRole,
  type AcademyUser,
} from '@/services/academy-admin-service'
import {
  MoreHorizontal,
  Search,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useTranslation } from '@/hooks/use-translation'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

type FilterRole = 'all' | AcademyUserRole

const roleVariant: Record<
  AcademyUserRole,
  'default' | 'secondary' | 'outline'
> = {
  admin: 'default',
  teacher: 'secondary',
  student: 'outline',
}

interface AcademyUsersPageProps {
  defaultRole?: FilterRole
}

export function AcademyUsersPage({
  defaultRole = 'all',
}: AcademyUsersPageProps) {
  const { academySlug } = useParams({ strict: false })
  const { user, currentAcademy } = useAuthStore()
  const queryClient = useQueryClient()
  const { t } = useTranslation()

  const [search, setSearch] = useState('')
  const [role, setRole] = useState<FilterRole>(defaultRole)
  const [page, setPage] = useState(1)
  const [userToRemove, setUserToRemove] = useState<AcademyUser | null>(null)

  const slug = academySlug ?? ''

  const { data, isLoading } = useQuery({
    queryKey: ['academy-users', slug, role, search, page],
    queryFn: () =>
      academyAdminService.getUsers(slug, {
        role: role === 'all' ? undefined : role,
        search: search || undefined,
        page,
        per_page: 20,
      }),
    enabled: !!slug,
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({
      userId,
      newRole,
    }: {
      userId: number
      newRole: AcademyUserRole
    }) => academyAdminService.updateUserRole(slug, userId, newRole),
    onSuccess: () => {
      toast.success(t('academyUsers.roleUpdated'))
      queryClient.invalidateQueries({ queryKey: ['academy-users', slug] })
    },
    onError: () => toast.error(t('academyUsers.roleUpdateError')),
  })

  const removeUserMutation = useMutation({
    mutationFn: (userId: number) =>
      academyAdminService.removeUser(slug, userId),
    onSuccess: () => {
      toast.success(t('academyUsers.userRemoved'))
      queryClient.invalidateQueries({ queryKey: ['academy-users', slug] })
      setUserToRemove(null)
    },
    onError: () => toast.error(t('academyUsers.removeError')),
  })

  const users = data?.data ?? []
  const pagination = data?.meta?.pagination
  const roleCounts = data?.meta?.role_counts

  const titleMap: Record<FilterRole, string> = {
    all: t('academyUsers.titles.all'),
    admin: t('academyUsers.titles.admins'),
    teacher: t('academyUsers.titles.teachers'),
    student: t('academyUsers.titles.students'),
  }

  return (
    <DashboardLayout
      user={user}
      academy={currentAcademy}
      variant='full'
      title={titleMap[role]}
      subtitle={t('academyUsers.subtitle')}
    >
      <div className='space-y-4'>
        {/* Role tabs */}
        <Tabs
          value={role}
          onValueChange={(v) => {
            setRole(v as FilterRole)
            setPage(1)
          }}
        >
          <TabsList>
            <TabsTrigger value='all'>{t('academyUsers.tabs.all')}</TabsTrigger>
            <TabsTrigger value='admin'>
              {t('academyUsers.tabs.admins')}
              {roleCounts && (
                <span className='ml-1.5 text-xs opacity-70'>
                  {roleCounts.admin}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value='teacher'>
              {t('academyUsers.tabs.teachers')}
              {roleCounts && (
                <span className='ml-1.5 text-xs opacity-70'>
                  {roleCounts.teacher}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value='student'>
              {t('academyUsers.tabs.students')}
              {roleCounts && (
                <span className='ml-1.5 text-xs opacity-70'>
                  {roleCounts.student}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search */}
        <div className='relative max-w-sm'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder={t('academyUsers.searchPlaceholder')}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className='pl-9'
          />
        </div>

        {/* Table */}
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('academyUsers.columns.name')}</TableHead>
                <TableHead>{t('academyUsers.columns.email')}</TableHead>
                <TableHead>{t('academyUsers.columns.role')}</TableHead>
                <TableHead>{t('academyUsers.columns.joined')}</TableHead>
                <TableHead>{t('academyUsers.columns.activity')}</TableHead>
                <TableHead className='w-10' />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className='h-4 w-full' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className='text-muted-foreground py-10 text-center'
                  >
                    {t('academyUsers.empty')}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className='font-medium'>{u.name}</TableCell>
                    <TableCell className='text-muted-foreground'>
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[u.role]}>
                        {t(`academyUsers.roles.${u.role}`)}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {new Date(u.joined_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-muted-foreground text-sm'>
                      {u.enrollments != null &&
                        `${u.enrollments} ${t('academyUsers.enrollments')}`}
                      {u.courses_teaching != null &&
                        `${u.courses_teaching} ${t('academyUsers.courses')}`}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8'
                          >
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          {u.role !== 'admin' && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateRoleMutation.mutate({
                                  userId: u.id,
                                  newRole: 'admin',
                                })
                              }
                            >
                              <ShieldCheck className='mr-2 h-4 w-4' />
                              {t('academyUsers.actions.makeAdmin')}
                            </DropdownMenuItem>
                          )}
                          {u.role !== 'teacher' && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateRoleMutation.mutate({
                                  userId: u.id,
                                  newRole: 'teacher',
                                })
                              }
                            >
                              <UserCheck className='mr-2 h-4 w-4' />
                              {t('academyUsers.actions.makeTeacher')}
                            </DropdownMenuItem>
                          )}
                          {u.role !== 'student' && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateRoleMutation.mutate({
                                  userId: u.id,
                                  newRole: 'student',
                                })
                              }
                            >
                              <GraduationCap className='mr-2 h-4 w-4' />
                              {t('academyUsers.actions.makeStudent')}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className='text-destructive focus:text-destructive'
                            onClick={() => setUserToRemove(u)}
                          >
                            <Trash2 className='mr-2 h-4 w-4' />
                            {t('academyUsers.actions.remove')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className='flex items-center justify-between'>
            <p className='text-muted-foreground text-sm'>
              {t('academyUsers.pagination', {
                from: (pagination.current_page - 1) * pagination.per_page + 1,
                to: Math.min(
                  pagination.current_page * pagination.per_page,
                  pagination.total_count
                ),
                total: pagination.total_count,
              })}
            </p>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={!pagination.prev_page}
                onClick={() => setPage((p) => p - 1)}
              >
                {t('common.previous')}
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled={!pagination.next_page}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('common.next')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Remove user dialog */}
      <AlertDialog
        open={!!userToRemove}
        onOpenChange={(open) => !open && setUserToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('academyUsers.removeDialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('academyUsers.removeDialog.description', {
                name: userToRemove?.name ?? '',
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={() =>
                userToRemove && removeUserMutation.mutate(userToRemove.id)
              }
            >
              {t('academyUsers.removeDialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
