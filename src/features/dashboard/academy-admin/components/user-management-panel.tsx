import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DashboardCard, ListCard } from '@/components/dashboard/dashboard-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Users, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  UserCheck,
  GraduationCap,
  Shield,
  Mail,
  Calendar
} from 'lucide-react'
import { academyAdminQueries, academyAdminMutations } from '@/lib/api/academy-admin'
import type { AcademyMembership } from '@/stores/auth-store'

export interface AcademyUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  status: 'active' | 'inactive' | 'pending'
  joinedAt: string
  lastActive: string
  enrollments?: number // For students
  coursesTeaching?: number // For teachers
  avatar?: string
}

interface UserManagementPanelProps {
  academy: AcademyMembership
  loading?: boolean
}

export function UserManagementPanel({ academy, loading = false }: UserManagementPanelProps) {
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'teacher' | 'student'>('all')
  const queryClient = useQueryClient()

  const filters = selectedRole === 'all' ? {} : { role: selectedRole }

  const { 
    data: usersResponse, 
    isLoading, 
    error 
  } = useQuery({
    ...academyAdminQueries.users(academy.id, filters),
    enabled: !!academy?.id && !loading,
  })

  const removeUserMutation = useMutation({
    ...academyAdminMutations.removeUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-admin', 'users', academy.id] })
    },
  })

  const updateRoleMutation = useMutation({
    ...academyAdminMutations.updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-admin', 'users', academy.id] })
    },
  })

  const users = usersResponse?.data || []
  const usersByRole = usersResponse?.meta?.role_counts || { admin: 0, teacher: 0, student: 0 }

  const getRoleBadge = (role: AcademyUser['role']) => {
    const variants = {
      admin: 'destructive',
      teacher: 'default',
      student: 'secondary'
    } as const

    const labels = {
      admin: 'Admin',
      teacher: 'Teacher',
      student: 'Student'
    }

    return (
      <Badge variant={variants[role]}>
        {labels[role]}
      </Badge>
    )
  }

  const getStatusBadge = (status: AcademyUser['status']) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      pending: 'outline'
    } as const

    const labels = {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const getRoleIcon = (role: AcademyUser['role']) => {
    switch (role) {
      case 'admin':
        return Shield
      case 'teacher':
        return UserCheck
      case 'student':
        return GraduationCap
      default:
        return Users
    }
  }

  const handleInviteUser = () => {
    // TODO: Implement user invitation
    console.log('Invite new user')
  }

  const handleEditUser = (userId: number) => {
    // TODO: Implement user editing
    console.log('Edit user:', userId)
  }

  const handleViewUser = (userId: number) => {
    // TODO: Implement user viewing
    console.log('View user:', userId)
  }

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to remove this user from the academy? This action cannot be undone.')) {
      try {
        await removeUserMutation.mutateAsync({ academyId: academy.id, userId })
      } catch (error) {
        console.error('Failed to remove user:', error)
        // TODO: Show error toast
      }
    }
  }

  if (error) {
    return (
      <DashboardCard title="Error" variant="outline">
        <p className="text-destructive">Failed to load users. Please try again.</p>
      </DashboardCard>
    )
  }

  const userItems = users.map(user => {
    const RoleIcon = getRoleIcon(user.role)
    
    return {
      id: user.id,
      title: (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{user.name}</span>
            {getRoleBadge(user.role)}
            {getStatusBadge(user.status)}
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
            </span>
            {user.role === 'student' && user.enrollments && (
              <span>{user.enrollments} enrollments</span>
            )}
            {user.role === 'teacher' && user.coursesTeaching && (
              <span>{user.coursesTeaching} courses</span>
            )}
          </div>
        </div>
      ),
      subtitle: `Last active: ${new Date(user.lastActive).toLocaleDateString()}`,
      value: (
        <div className="flex items-center space-x-2">
          <RoleIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      ),
      action: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </DropdownMenuItem>
            {user.role !== 'admin' && (
              <DropdownMenuItem 
                onClick={() => handleDeleteUser(user.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  })

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </DashboardCard>

        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Admins</p>
              <p className="text-2xl font-bold">{usersByRole.admin}</p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </DashboardCard>

        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teachers</p>
              <p className="text-2xl font-bold">{usersByRole.teacher}</p>
            </div>
            <UserCheck className="h-8 w-8 text-blue-500" />
          </div>
        </DashboardCard>

        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Students</p>
              <p className="text-2xl font-bold">{usersByRole.student}</p>
            </div>
            <GraduationCap className="h-8 w-8 text-green-500" />
          </div>
        </DashboardCard>
      </div>

      {/* Role Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Filter by role:</span>
        {(['all', 'admin', 'teacher', 'student'] as const).map((role) => (
          <Button
            key={role}
            variant={selectedRole === role ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedRole(role)}
          >
            {role === 'all' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1)}
          </Button>
        ))}
      </div>

      {/* User List */}
      <ListCard
        title="User Management"
        description={`Manage ${selectedRole === 'all' ? 'all users' : `${selectedRole}s`} in your academy`}
        action={
          <Button onClick={handleInviteUser} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        }
        items={userItems}
        emptyMessage={`No ${selectedRole === 'all' ? 'users' : `${selectedRole}s`} found.`}
        loading={isLoading}
      />
    </div>
  )
}