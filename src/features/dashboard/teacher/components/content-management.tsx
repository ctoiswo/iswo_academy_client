import { useState } from 'react'
import {
  FileText,
  Video,
  HelpCircle,
  ClipboardList,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DashboardCard, ListCard } from '@/components/dashboard/dashboard-card'
import type { LessonContent, Assignment, TeacherCourse } from '../types'

interface ContentManagementProps {
  courses: TeacherCourse[]
  lessons: LessonContent[]
  assignments: Assignment[]
  loading?: boolean
  onCreateLesson?: (courseId: number) => void
  onCreateAssignment?: (courseId: number) => void
  onEditLesson?: (lessonId: number) => void
  onEditAssignment?: (assignmentId: number) => void
  onViewLesson?: (lessonId: number) => void
  onDeleteLesson?: (lessonId: number) => void
  onDeleteAssignment?: (assignmentId: number) => void
}

export function ContentManagement({
  courses,
  lessons,
  assignments,
  loading = false,
  onCreateLesson,
  onCreateAssignment,
  onEditLesson,
  onEditAssignment,
  onViewLesson,
  onDeleteLesson,
  onDeleteAssignment,
}: ContentManagementProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [contentType, setContentType] = useState<
    'all' | 'lessons' | 'assignments'
  >('all')

  const getContentIcon = (type: LessonContent['type']) => {
    const icons = {
      video: Video,
      text: FileText,
      quiz: HelpCircle,
      assignment: ClipboardList,
    }
    return icons[type] || FileText
  }

  const getContentTypeBadge = (type: LessonContent['type']) => {
    const variants = {
      video: 'default',
      text: 'secondary',
      quiz: 'outline',
      assignment: 'destructive',
    } as const

    const labels = {
      video: 'Video',
      text: 'Text',
      quiz: 'Quiz',
      assignment: 'Assignment',
    }

    return <Badge variant={variants[type]}>{labels[type]}</Badge>
  }

  const getAssignmentStatusBadge = (assignment: Assignment) => {
    const now = new Date()
    const dueDate = new Date(assignment.dueDate)
    const isOverdue = now > dueDate
    const isDueSoon = dueDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000 // 24 hours

    if (assignment.status === 'closed') {
      return <Badge variant='secondary'>Closed</Badge>
    }
    if (assignment.status === 'draft') {
      return <Badge variant='outline'>Draft</Badge>
    }
    if (isOverdue) {
      return <Badge variant='destructive'>Overdue</Badge>
    }
    if (isDueSoon) {
      return <Badge variant='secondary'>Due Soon</Badge>
    }
    return <Badge variant='default'>Active</Badge>
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A'
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Filter lessons by course
  const filteredLessons = lessons.filter((_lesson) => {
    if (selectedCourse === 'all') return true
    // Note: In a real implementation, lessons would have a courseId field
    return true // Placeholder logic
  })

  // Filter assignments by course
  const filteredAssignments = assignments.filter((assignment) => {
    if (selectedCourse === 'all') return true
    return assignment.course.id.toString() === selectedCourse
  })

  const lessonItems = filteredLessons.map((lesson) => {
    const Icon = getContentIcon(lesson.type)
    return {
      id: lesson.id,
      title: (
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Icon className='h-4 w-4' />
            <span className='font-medium'>{lesson.title}</span>
            {getContentTypeBadge(lesson.type)}
            {!lesson.isPublished && <Badge variant='outline'>Draft</Badge>}
          </div>
          <p className='text-muted-foreground line-clamp-2 text-xs'>
            {lesson.description}
          </p>
          <div className='text-muted-foreground flex items-center space-x-4 text-xs'>
            <span className='flex items-center space-x-1'>
              <Clock className='h-3 w-3' />
              <span>{formatDuration(lesson.duration)}</span>
            </span>
            <span>Order: {lesson.order}</span>
            <span>Updated {formatDate(lesson.updatedAt)}</span>
          </div>
        </div>
      ),
      subtitle: lesson.isPublished ? 'Published' : 'Draft',
      value: lesson.type,
      action: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onViewLesson?.(lesson.id)}>
              <Eye className='mr-2 h-4 w-4' />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditLesson?.(lesson.id)}>
              <Edit className='mr-2 h-4 w-4' />
              Edit Content
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteLesson?.(lesson.id)}
              className='text-destructive'
            >
              <Trash2 className='mr-2 h-4 w-4' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  })

  const assignmentItems = filteredAssignments.map((assignment) => ({
    id: assignment.id,
    title: (
      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <ClipboardList className='h-4 w-4' />
          <span className='font-medium'>{assignment.title}</span>
          {getAssignmentStatusBadge(assignment)}
        </div>
        <p className='text-muted-foreground line-clamp-2 text-xs'>
          {assignment.description}
        </p>
        <div className='text-muted-foreground flex items-center space-x-4 text-xs'>
          <span>Due: {formatDate(assignment.dueDate)}</span>
          <span>
            {assignment.submissions}/{assignment.totalStudents} submitted
          </span>
        </div>
      </div>
    ),
    subtitle: `Course: ${assignment.course.title}`,
    value: `${assignment.submissions}/${assignment.totalStudents}`,
    action: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => onEditAssignment?.(assignment.id)}>
            <Edit className='mr-2 h-4 w-4' />
            Edit Assignment
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Eye className='mr-2 h-4 w-4' />
            View Submissions
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDeleteAssignment?.(assignment.id)}
            className='text-destructive'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }))

  const publishedLessons = lessons.filter((l) => l.isPublished).length
  const draftLessons = lessons.filter((l) => !l.isPublished).length
  const activeAssignments = assignments.filter(
    (a) => a.status === 'active'
  ).length
  const overdueAssignments = assignments.filter((a) => {
    return a.status === 'active' && new Date() > new Date(a.dueDate)
  }).length

  return (
    <div className='space-y-6'>
      {/* Content Statistics */}
      <div className='grid gap-4 md:grid-cols-4'>
        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Total Lessons
              </p>
              <p className='text-2xl font-bold'>{lessons.length}</p>
              <p className='text-muted-foreground text-xs'>
                {publishedLessons} published, {draftLessons} draft
              </p>
            </div>
            <FileText className='text-muted-foreground h-8 w-8' />
          </div>
        </DashboardCard>

        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Assignments
              </p>
              <p className='text-2xl font-bold'>{assignments.length}</p>
              <p className='text-muted-foreground text-xs'>
                {activeAssignments} active
              </p>
            </div>
            <ClipboardList className='text-muted-foreground h-8 w-8' />
          </div>
        </DashboardCard>

        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Published
              </p>
              <p className='text-2xl font-bold'>{publishedLessons}</p>
            </div>
            <CheckCircle className='h-8 w-8 text-green-500' />
          </div>
        </DashboardCard>

        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Overdue
              </p>
              <p className='text-2xl font-bold'>{overdueAssignments}</p>
            </div>
            <AlertCircle className='h-8 w-8 text-red-500' />
          </div>
        </DashboardCard>
      </div>

      {/* Filters */}
      <div className='flex space-x-4'>
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Filter by course' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Courses</SelectItem>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='flex space-x-2'>
          {(['all', 'lessons', 'assignments'] as const).map((type) => (
            <Button
              key={type}
              variant={contentType === type ? 'default' : 'outline'}
              size='sm'
              onClick={() => setContentType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Lists */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {(contentType === 'all' || contentType === 'lessons') && (
          <ListCard
            title='Lessons & Content'
            description='Manage your course content and materials'
            action={
              <Button
                onClick={() => onCreateLesson?.(courses[0]?.id)}
                size='sm'
                disabled={courses.length === 0}
              >
                <Plus className='mr-2 h-4 w-4' />
                New Lesson
              </Button>
            }
            items={lessonItems as any}
            emptyMessage='No lessons found. Create your first lesson to get started.'
            loading={loading}
          />
        )}

        {(contentType === 'all' || contentType === 'assignments') && (
          <ListCard
            title='Assignments'
            description='Manage assignments and track submissions'
            action={
              <Button
                onClick={() => onCreateAssignment?.(courses[0]?.id)}
                size='sm'
                disabled={courses.length === 0}
              >
                <Plus className='mr-2 h-4 w-4' />
                New Assignment
              </Button>
            }
            items={assignmentItems as any}
            emptyMessage='No assignments found. Create your first assignment.'
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}
