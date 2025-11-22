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
  BookOpen, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2, 
  Users,
  DollarSign,
  Clock
} from 'lucide-react'
import { academyAdminQueries, academyAdminMutations } from '@/lib/api/academy-admin'
import type { AcademyMembership } from '@/stores/auth-store'

export interface Course {
  id: number
  title: string
  description: string
  status: 'draft' | 'published' | 'archived'
  enrollments: number
  revenue: number
  teacher: {
    id: number
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  price: number
  duration: string // e.g., "8 weeks", "12 hours"
}

interface CourseManagementPanelProps {
  academy: AcademyMembership
  loading?: boolean
}

export function CourseManagementPanel({ academy, loading = false }: CourseManagementPanelProps) {
  const [filters, setFilters] = useState({})
  const queryClient = useQueryClient()

  const academyIdentifier = academy.slug || academy.id

  const { 
    data: coursesResponse, 
    isLoading, 
    error 
  } = useQuery({
    ...academyAdminQueries.courses(academyIdentifier, filters),
    enabled: !!(academy?.slug || academy?.id) && !loading,
  })

  const deleteMutation = useMutation({
    ...academyAdminMutations.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['academy-admin', 'courses', academyIdentifier] })
    },
  })

  const courses = coursesResponse?.data || []

  const getStatusBadge = (status: Course['status']) => {
    const variants = {
      draft: 'secondary',
      published: 'default',
      archived: 'outline'
    } as const

    const labels = {
      draft: 'Draft',
      published: 'Published',
      archived: 'Archived'
    }

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  const handleCreateCourse = () => {
    // TODO: Implement course creation
    console.log('Create new course')
  }

  const handleEditCourse = (courseId: number) => {
    // TODO: Implement course editing
    console.log('Edit course:', courseId)
  }

  const handleViewCourse = (courseId: number) => {
    // TODO: Implement course viewing
    console.log('View course:', courseId)
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync({ academyIdentifier, courseId })
      } catch (error) {
        console.error('Failed to delete course:', error)
        // TODO: Show error toast
      }
    }
  }

  const courseItems = courses.map(course => ({
    id: course.id,
    title: (
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{course.title}</span>
          {getStatusBadge(course.status)}
        </div>
        <p className="text-xs text-muted-foreground">{course.description}</p>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{course.enrollments} students</span>
          </span>
          <span className="flex items-center space-x-1">
            <DollarSign className="h-3 w-3" />
            <span>${course.revenue.toLocaleString()}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{course.duration}</span>
          </span>
        </div>
      </div>
    ),
    subtitle: `Teacher: ${course.teacher.name}`,
    value: `$${course.price}`,
    action: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleViewCourse(course.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleEditCourse(course.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Course
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleDeleteCourse(course.id)}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }))

  if (error) {
    return (
      <DashboardCard title="Error" variant="outline">
        <p className="text-destructive">Failed to load courses. Please try again.</p>
      </DashboardCard>
    )
  }

  return (
    <div className="space-y-6">
      {/* Course Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
        </DashboardCard>

        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Published</p>
              <p className="text-2xl font-bold">
                {courses.filter(c => c.status === 'published').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-green-500" />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">In Draft</p>
              <p className="text-2xl font-bold">
                {courses.filter(c => c.status === 'draft').length}
              </p>
            </div>
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-yellow-500" />
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Course List */}
      <ListCard
        title="Course Management"
        description="Manage all courses in your academy"
        action={
          <Button onClick={handleCreateCourse} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>
        }
        items={courseItems}
        emptyMessage="No courses found. Create your first course to get started."
        loading={isLoading}
      />
    </div>
  )
}