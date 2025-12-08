import { useState } from 'react'
import {
  BookOpen,
  Users,
  TrendingUp,
  ClipboardCheck,
  DollarSign,
} from 'lucide-react'
import { toast } from 'sonner'
import { Sidebar, SidebarContent, SidebarHeader } from '@/components/ui/sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { DashboardProps } from '@/components/dashboard-router'
import { StatsWidget } from '@/components/dashboard/stats-widget'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  RoleNavigation,
  useRoleNavigation,
} from '@/components/layout/role-navigation'
import { ContentManagement } from './components/content-management'
import { MyCourses } from './components/my-courses'
import { StudentProgress } from './components/student-progress'
import type {
  TeacherCourse,
  StudentProgress as StudentProgressType,
  LessonContent,
  Assignment,
  TeacherStats,
} from './types'

function TeacherSidebar({ user, academy, dashboardType }: any) {
  const { currentPath } = useRoleNavigation(academy)

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className='px-4 py-2 text-lg font-semibold'>Teaching Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <RoleNavigation
          user={user}
          academy={academy}
          dashboardType={dashboardType || 'teacher'}
          currentPath={currentPath}
          className='px-4'
        />
      </SidebarContent>
    </Sidebar>
  )
}

// Mock data - in real implementation, this would come from API
const mockTeacherStats: TeacherStats = {
  totalCourses: 5,
  totalStudents: 127,
  averageCompletionRate: 78,
  pendingReviews: 12,
  totalRevenue: 15420,
  monthlyStats: {
    newEnrollments: 23,
    completedCourses: 8,
    revenue: 2340,
  },
}

const mockCourses: TeacherCourse[] = [
  {
    id: 1,
    title: 'Introduction to React',
    description:
      'Learn the fundamentals of React development with hands-on projects and real-world examples.',
    status: 'published',
    enrollments: 45,
    completionRate: 82,
    totalLessons: 12,
    completedLessons: 10,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    price: 99,
    duration: '8 weeks',
    academy: { id: 1, name: 'Tech Academy' },
  },
  {
    id: 2,
    title: 'Advanced JavaScript Patterns',
    description:
      'Master advanced JavaScript concepts and design patterns for professional development.',
    status: 'published',
    enrollments: 32,
    completionRate: 75,
    totalLessons: 15,
    completedLessons: 12,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
    price: 149,
    duration: '10 weeks',
    academy: { id: 1, name: 'Tech Academy' },
  },
  {
    id: 3,
    title: 'Node.js Backend Development',
    description:
      'Build scalable backend applications with Node.js, Express, and MongoDB.',
    status: 'draft',
    enrollments: 0,
    completionRate: 0,
    totalLessons: 20,
    completedLessons: 5,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-08T00:00:00Z',
    price: 199,
    duration: '12 weeks',
    academy: { id: 1, name: 'Tech Academy' },
  },
]

const mockStudentProgress: StudentProgressType[] = [
  {
    id: 1,
    student: {
      id: 101,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: undefined,
    },
    course: { id: 1, title: 'Introduction to React' },
    progress: 85,
    completedLessons: 10,
    totalLessons: 12,
    lastActivity: '2024-02-09T14:30:00Z',
    enrolledAt: '2024-01-20T00:00:00Z',
    status: 'active',
  },
  {
    id: 2,
    student: {
      id: 102,
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: undefined,
    },
    course: { id: 1, title: 'Introduction to React' },
    progress: 100,
    completedLessons: 12,
    totalLessons: 12,
    lastActivity: '2024-02-08T16:45:00Z',
    enrolledAt: '2024-01-18T00:00:00Z',
    completedAt: '2024-02-08T16:45:00Z',
    status: 'completed',
  },
  {
    id: 3,
    student: {
      id: 103,
      name: 'Carol Davis',
      email: 'carol@example.com',
      avatar: undefined,
    },
    course: { id: 2, title: 'Advanced JavaScript Patterns' },
    progress: 45,
    completedLessons: 7,
    totalLessons: 15,
    lastActivity: '2024-02-05T10:20:00Z',
    enrolledAt: '2024-01-25T00:00:00Z',
    status: 'active',
  },
]

const mockLessons: LessonContent[] = [
  {
    id: 1,
    title: 'React Components Basics',
    description: 'Learn how to create and use React components effectively.',
    type: 'video',
    duration: 45,
    content: 'Video content here...',
    order: 1,
    isPublished: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 2,
    title: 'State Management with Hooks',
    description: 'Understanding useState and useEffect hooks in React.',
    type: 'video',
    duration: 60,
    content: 'Video content here...',
    order: 2,
    isPublished: true,
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-21T00:00:00Z',
  },
  {
    id: 3,
    title: 'Component Props Exercise',
    description: 'Practice passing data between components using props.',
    type: 'assignment',
    duration: 120,
    content: 'Assignment instructions...',
    order: 3,
    isPublished: false,
    createdAt: '2024-01-17T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
]

const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Build a Todo App',
    description:
      'Create a fully functional todo application using React hooks and local storage.',
    dueDate: '2024-02-15T23:59:00Z',
    course: { id: 1, title: 'Introduction to React' },
    submissions: 38,
    totalStudents: 45,
    status: 'active',
    createdAt: '2024-01-25T00:00:00Z',
  },
  {
    id: 2,
    title: 'JavaScript Design Patterns Quiz',
    description:
      'Test your knowledge of common JavaScript design patterns and their implementations.',
    dueDate: '2024-02-12T23:59:00Z',
    course: { id: 2, title: 'Advanced JavaScript Patterns' },
    submissions: 28,
    totalStudents: 32,
    status: 'active',
    createdAt: '2024-01-30T00:00:00Z',
  },
]

export function TeacherDashboard({ user, academy }: DashboardProps) {
  const [loading, _setLoading] = useState(false)

  if (!user) return null

  const handleCreateCourse = () => {}

  const handleEditCourse = (courseId: number) => {
    toast.info(`Edit course feature coming soon! (Course ID: ${courseId})`)
  }

  const handleViewCourse = (courseId: number) => {
    toast.info(`View course feature coming soon! (Course ID: ${courseId})`)
  }

  const handleManageCourse = (courseId: number) => {
    toast.info(`Manage course feature coming soon! (Course ID: ${courseId})`)
  }

  const handleViewStudent = (studentId: number) => {
    toast.info(`View student feature coming soon! (Student ID: ${studentId})`)
  }

  const handleMessageStudent = (studentId: number) => {
    toast.info(
      `Message student feature coming soon! (Student ID: ${studentId})`
    )
  }

  const handleViewProgress = (studentId: number, courseId: number) => {
    toast.info(
      `View progress feature coming soon! (Student ID: ${studentId}, Course ID: ${courseId})`
    )
  }

  const handleCreateLesson = (courseId: number) => {
    toast.info(`Create lesson feature coming soon! (Course ID: ${courseId})`)
  }

  const handleCreateAssignment = (courseId: number) => {
    toast.info(
      `Create assignment feature coming soon! (Course ID: ${courseId})`
    )
  }

  const handleEditLesson = (lessonId: number) => {
    toast.info(`Edit lesson feature coming soon! (Lesson ID: ${lessonId})`)
  }

  const handleEditAssignment = (assignmentId: number) => {
    toast.info(
      `Edit assignment feature coming soon! (Assignment ID: ${assignmentId})`
    )
  }

  const handleViewLesson = (lessonId: number) => {
    toast.info(`View lesson feature coming soon! (Lesson ID: ${lessonId})`)
  }

  const handleDeleteLesson = (lessonId: number) => {
    toast.info(`Delete lesson feature coming soon! (Lesson ID: ${lessonId})`)
  }

  const handleDeleteAssignment = (assignmentId: number) => {
    toast.info(
      `Delete assignment feature coming soon! (Assignment ID: ${assignmentId})`
    )
  }

  return (
    <DashboardLayout
      user={user}
      academy={academy}
      variant='sidebar'
      dashboardType='teacher'
      sidebar={TeacherSidebar}
    >
      <div className='space-y-6 p-6'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Teaching Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Manage your courses and track student progress
          </p>
        </div>

        {/* Teacher Statistics */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
          <StatsWidget
            title='My Courses'
            value={mockTeacherStats.totalCourses}
            icon={BookOpen}
            loading={loading}
          />

          <StatsWidget
            title='Total Students'
            value={mockTeacherStats.totalStudents}
            change={12}
            changeType='increase'
            icon={Users}
            loading={loading}
          />

          <StatsWidget
            title='Completion Rate'
            value={mockTeacherStats.averageCompletionRate}
            format='percentage'
            change={5}
            changeType='increase'
            icon={TrendingUp}
            loading={loading}
          />

          <StatsWidget
            title='Pending Reviews'
            value={mockTeacherStats.pendingReviews}
            icon={ClipboardCheck}
            loading={loading}
          />

          <StatsWidget
            title='Total Revenue'
            value={mockTeacherStats.totalRevenue}
            format='currency'
            change={8}
            changeType='increase'
            icon={DollarSign}
            loading={loading}
          />
        </div>

        {/* Teacher Dashboard Tabs */}
        <Tabs defaultValue='courses' className='space-y-6'>
          <TabsList>
            <TabsTrigger value='courses'>My Courses</TabsTrigger>
            <TabsTrigger value='students'>Student Progress</TabsTrigger>
            <TabsTrigger value='content'>Content Management</TabsTrigger>
          </TabsList>

          <TabsContent value='courses' className='space-y-6'>
            <MyCourses
              courses={mockCourses}
              loading={loading}
              onCreateCourse={handleCreateCourse}
              onEditCourse={handleEditCourse}
              onViewCourse={handleViewCourse}
              onManageCourse={handleManageCourse}
            />
          </TabsContent>

          <TabsContent value='students' className='space-y-6'>
            <StudentProgress
              students={mockStudentProgress}
              courses={mockCourses}
              loading={loading}
              onViewStudent={handleViewStudent}
              onMessageStudent={handleMessageStudent}
              onViewProgress={handleViewProgress}
            />
          </TabsContent>

          <TabsContent value='content' className='space-y-6'>
            <ContentManagement
              courses={mockCourses}
              lessons={mockLessons}
              assignments={mockAssignments}
              loading={loading}
              onCreateLesson={handleCreateLesson}
              onCreateAssignment={handleCreateAssignment}
              onEditLesson={handleEditLesson}
              onEditAssignment={handleEditAssignment}
              onViewLesson={handleViewLesson}
              onDeleteLesson={handleDeleteLesson}
              onDeleteAssignment={handleDeleteAssignment}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
