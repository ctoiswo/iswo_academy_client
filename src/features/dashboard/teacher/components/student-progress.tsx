import { useState } from 'react'
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  MoreHorizontal,
  MessageCircle,
  Eye,
  Award,
  AlertCircle,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DashboardCard, ListCard } from '@/components/dashboard/dashboard-card'
import type {
  StudentProgress as StudentProgressType,
  TeacherCourse,
} from '../types'

interface StudentProgressProps {
  students: StudentProgressType[]
  courses: TeacherCourse[]
  loading?: boolean
  onViewStudent?: (studentId: number) => void
  onMessageStudent?: (studentId: number) => void
  onViewProgress?: (studentId: number, courseId: number) => void
}

export function StudentProgress({
  students,
  courses,
  loading = false,
  onViewStudent,
  onMessageStudent,
  onViewProgress,
}: StudentProgressProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'completed' | 'dropped'
  >('all')

  const filteredStudents = students.filter((student) => {
    if (
      selectedCourse !== 'all' &&
      student.course.id.toString() !== selectedCourse
    ) {
      return false
    }
    if (statusFilter !== 'all' && student.status !== statusFilter) {
      return false
    }
    return true
  })

  const getStatusBadge = (status: StudentProgressType['status']) => {
    const variants = {
      active: 'default',
      completed: 'secondary',
      dropped: 'destructive',
    } as const

    const labels = {
      active: 'Active',
      completed: 'Completed',
      dropped: 'Dropped',
    }

    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const studentItems = filteredStudents.map((student) => ({
    id: student.id,
    title: (
      <div className='flex items-center space-x-3'>
        <Avatar className='h-10 w-10'>
          <AvatarImage src={student.student.avatar} />
          <AvatarFallback>
            {student.student.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div className='space-y-1'>
          <div className='flex items-center space-x-2'>
            <span className='font-medium'>{student.student.name}</span>
            {getStatusBadge(student.status)}
          </div>
          <p className='text-muted-foreground text-xs'>
            {student.student.email}
          </p>
          <div className='text-muted-foreground flex items-center space-x-4 text-xs'>
            <span className='flex items-center space-x-1'>
              <CheckCircle className='h-3 w-3' />
              <span>
                {student.completedLessons}/{student.totalLessons} lessons
              </span>
            </span>
            <span className='flex items-center space-x-1'>
              <Clock className='h-3 w-3' />
              <span>Last active {formatTimeAgo(student.lastActivity)}</span>
            </span>
          </div>
          <div className='space-y-1'>
            <div className='flex justify-between text-xs'>
              <span>Progress</span>
              <span>{student.progress}%</span>
            </div>
            <Progress value={student.progress} className='h-2' />
          </div>
        </div>
      </div>
    ),
    subtitle: `Course: ${student.course.title}`,
    value:
      student.status === 'completed' ? (
        <div className='flex items-center space-x-1 text-green-600'>
          <Award className='h-4 w-4' />
          <span className='text-sm font-medium'>Completed</span>
        </div>
      ) : (
        <div className='text-right'>
          <div className='text-sm font-medium'>{student.progress}%</div>
          <div className='text-muted-foreground text-xs'>
            {student.totalLessons - student.completedLessons} remaining
          </div>
        </div>
      ),
    action: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='sm'>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() =>
              onViewProgress?.(student.student.id, student.course.id)
            }
          >
            <Eye className='mr-2 h-4 w-4' />
            View Progress
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewStudent?.(student.student.id)}>
            <Users className='mr-2 h-4 w-4' />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onMessageStudent?.(student.student.id)}
          >
            <MessageCircle className='mr-2 h-4 w-4' />
            Send Message
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }))

  const activeStudents = students.filter((s) => s.status === 'active').length
  const completedStudents = students.filter(
    (s) => s.status === 'completed'
  ).length
  const averageProgress =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + s.progress, 0) / students.length
        )
      : 0
  const atRiskStudents = students.filter((s) => {
    const daysSinceActivity = Math.floor(
      (new Date().getTime() - new Date(s.lastActivity).getTime()) /
        (1000 * 60 * 60 * 24)
    )
    return s.status === 'active' && (daysSinceActivity > 7 || s.progress < 20)
  }).length

  return (
    <div className='space-y-6'>
      {/* Student Statistics */}
      <div className='grid gap-4 md:grid-cols-4'>
        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Active Students
              </p>
              <p className='text-2xl font-bold'>{activeStudents}</p>
            </div>
            <Users className='text-muted-foreground h-8 w-8' />
          </div>
        </DashboardCard>

        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Completed
              </p>
              <p className='text-2xl font-bold'>{completedStudents}</p>
            </div>
            <CheckCircle className='h-8 w-8 text-green-500' />
          </div>
        </DashboardCard>

        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                Avg. Progress
              </p>
              <p className='text-2xl font-bold'>{averageProgress}%</p>
            </div>
            <TrendingUp className='text-muted-foreground h-8 w-8' />
          </div>
        </DashboardCard>

        <DashboardCard size='sm'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>
                At Risk
              </p>
              <p className='text-2xl font-bold'>{atRiskStudents}</p>
            </div>
            <AlertCircle className='h-8 w-8 text-orange-500' />
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
          {(['all', 'active', 'completed', 'dropped'] as const).map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                {status !== 'all' && (
                  <Badge variant='secondary' className='ml-2'>
                    {students.filter((s) => s.status === status).length}
                  </Badge>
                )}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Student List */}
      <ListCard
        title='Student Progress'
        description="Track your students' learning journey"
        items={studentItems}
        emptyMessage={
          selectedCourse !== 'all' || statusFilter !== 'all'
            ? 'No students match the selected filters.'
            : 'No students enrolled in your courses yet.'
        }
        loading={loading}
      />
    </div>
  )
}
