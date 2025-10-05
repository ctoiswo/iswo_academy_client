import { useState } from 'react'
import { DashboardCard, ListCard } from '@/components/dashboard/dashboard-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Settings,
  Plus,
  Clock,
  CheckCircle
} from 'lucide-react'
import type { TeacherCourse } from '../types'

interface MyCoursesProps {
  courses: TeacherCourse[]
  loading?: boolean
  onCreateCourse?: () => void
  onEditCourse?: (courseId: number) => void
  onViewCourse?: (courseId: number) => void
  onManageCourse?: (courseId: number) => void
}

export function MyCourses({ 
  courses, 
  loading = false,
  onCreateCourse,
  onEditCourse,
  onViewCourse,
  onManageCourse
}: MyCoursesProps) {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true
    return course.status === filter
  })

  const getStatusBadge = (status: TeacherCourse['status']) => {
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

  const courseItems = filteredCourses.map(course => ({
    id: course.id,
    title: (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{course.title}</span>
          {getStatusBadge(course.status)}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Users className="h-3 w-3" />
            <span>{course.enrollments} students</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{course.duration}</span>
          </span>
          <span className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>{course.completionRate}% completion</span>
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{course.completedLessons}/{course.totalLessons} lessons</span>
          </div>
          <Progress 
            value={(course.completedLessons / course.totalLessons) * 100} 
            className="h-2"
          />
        </div>
      </div>
    ),
    subtitle: `Academy: ${course.academy.name}`,
    value: `$${course.price}`,
    action: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewCourse?.(course.id)}>
            <Eye className="h-4 w-4 mr-2" />
            View Course
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEditCourse?.(course.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Content
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onManageCourse?.(course.id)}>
            <Settings className="h-4 w-4 mr-2" />
            Manage Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }))

  const publishedCourses = courses.filter(c => c.status === 'published').length
  const draftCourses = courses.filter(c => c.status === 'draft').length
  const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollments, 0)

  return (
    <div className="space-y-6">
      {/* Course Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">My Courses</p>
              <p className="text-2xl font-bold">{courses.length}</p>
              <p className="text-xs text-muted-foreground">
                {publishedCourses} published, {draftCourses} draft
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
        </DashboardCard>

        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold">{totalEnrollments}</p>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </DashboardCard>

        <DashboardCard size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Avg. Completion</p>
              <p className="text-2xl font-bold">
                {courses.length > 0 
                  ? Math.round(courses.reduce((sum, c) => sum + c.completionRate, 0) / courses.length)
                  : 0}%
              </p>
              <p className="text-xs text-muted-foreground">
                Student completion rate
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </div>
        </DashboardCard>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <Badge variant="secondary" className="ml-2">
                {courses.filter(c => c.status === status).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Course List */}
      <ListCard
        title="My Courses"
        description="Manage and track your teaching content"
        action={
          <Button onClick={onCreateCourse} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Course
          </Button>
        }
        items={courseItems}
        emptyMessage={
          filter === 'all' 
            ? "No courses found. Create your first course to get started."
            : `No ${filter} courses found.`
        }
        loading={loading}
      />
    </div>
  )
}