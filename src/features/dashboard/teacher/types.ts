export interface TeacherCourse {
  id: number
  slug?: string
  title: string
  description: string
  status: 'draft' | 'published' | 'archived'
  enrollments: number
  completionRate: number
  totalLessons: number
  completedLessons: number
  createdAt: string
  updatedAt: string
  price: number
  duration: string
  academy: {
    id: number
    name: string
  }
}

export interface StudentProgress {
  id: number
  student: {
    id: number
    name: string
    email: string
    avatar?: string
  }
  course: {
    id: number
    title: string
  }
  progress: number // 0-100
  completedLessons: number
  totalLessons: number
  lastActivity: string
  enrolledAt: string
  completedAt?: string
  status: 'active' | 'completed' | 'dropped'
}

export interface TeacherStats {
  totalCourses: number
  totalStudents: number
  averageCompletionRate: number
  pendingReviews: number
  totalRevenue: number
  monthlyStats: {
    newEnrollments: number
    completedCourses: number
    revenue: number
  }
}

export interface LessonContent {
  id: number
  title: string
  description: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  duration?: number
  content: string
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface Assignment {
  id: number
  title: string
  description: string
  dueDate: string
  course: {
    id: number
    title: string
  }
  submissions: number
  totalStudents: number
  status: 'active' | 'closed' | 'draft'
  createdAt: string
}

export interface TeacherDashboardData {
  stats: TeacherStats
  courses: TeacherCourse[]
  recentProgress: StudentProgress[]
  upcomingDeadlines: Assignment[]
  recentActivity: Array<{
    id: string
    type: 'enrollment' | 'completion' | 'submission' | 'question'
    message: string
    timestamp: string
    student?: {
      id: number
      name: string
    }
    course?: {
      id: number
      title: string
    }
  }>
}
