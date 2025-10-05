
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { StatsWidget } from '@/components/dashboard'
import { MyCourses, LearningProgress, Certificates } from './components'
import { BookOpen, GraduationCap, Award, TrendingUp } from 'lucide-react'
import type { DashboardProps } from '@/components/dashboard-router'
import type { StudentDashboardData } from './types'

const topNavLinks = [
  {
    title: 'Overview',
    href: 'dashboard',
    isActive: true,
  },
  {
    title: 'My Courses',
    href: 'courses',
    isActive: false,
  },
  {
    title: 'Achievements',
    href: 'achievements',
    isActive: false,
  },
]

// Mock data for development - will be replaced with API calls
const mockStudentData: StudentDashboardData = {
  stats: {
    total_enrollments: 5,
    completed_courses: 2,
    certificates_earned: 2,
    study_streak_days: 7,
    total_study_hours: 24,
    average_progress: 68
  },
  enrollments: [
    {
      id: 1,
      user_id: 1,
      course_id: 1,
      status: 'active',
      progress_percentage: 75,
      enrolled_at: '2024-01-15T10:00:00Z',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-03-01T10:00:00Z',
      course: {
        id: 1,
        title: 'Introduction to React',
        description: 'Learn the fundamentals of React development including components, state management, and hooks.',
        price: 99,
        difficulty_level: 'beginner',
        is_published: true,
        thumbnail_url: 'https://via.placeholder.com/300x200?text=React+Course',
        duration_minutes: 480,
        enrollment_count: 1250,
        academy_id: 1,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      }
    },
    {
      id: 2,
      user_id: 1,
      course_id: 2,
      status: 'completed',
      progress_percentage: 100,
      enrolled_at: '2024-01-01T10:00:00Z',
      completed_at: '2024-02-15T10:00:00Z',
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-02-15T10:00:00Z',
      course: {
        id: 2,
        title: 'JavaScript Fundamentals',
        description: 'Master the core concepts of JavaScript programming language.',
        price: 79,
        difficulty_level: 'beginner',
        is_published: true,
        thumbnail_url: 'https://via.placeholder.com/300x200?text=JavaScript+Course',
        duration_minutes: 360,
        enrollment_count: 2100,
        academy_id: 1,
        created_at: '2023-12-01T10:00:00Z',
        updated_at: '2023-12-01T10:00:00Z'
      }
    },
    {
      id: 3,
      user_id: 1,
      course_id: 3,
      status: 'active',
      progress_percentage: 45,
      enrolled_at: '2024-02-01T10:00:00Z',
      created_at: '2024-02-01T10:00:00Z',
      updated_at: '2024-03-01T10:00:00Z',
      course: {
        id: 3,
        title: 'Advanced TypeScript',
        description: 'Deep dive into TypeScript advanced features and patterns.',
        price: 129,
        difficulty_level: 'advanced',
        is_published: true,
        thumbnail_url: 'https://via.placeholder.com/300x200?text=TypeScript+Course',
        duration_minutes: 600,
        enrollment_count: 850,
        academy_id: 1,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    }
  ],
  certificates: [
    {
      id: 1,
      user_id: 1,
      course_id: 2,
      enrollment_id: 2,
      certificate_number: 'CERT-JS-2024-001',
      issued_at: '2024-02-15T10:00:00Z',
      course: {
        id: 2,
        title: 'JavaScript Fundamentals',
        description: 'Master the core concepts of JavaScript programming language.',
        price: 79,
        difficulty_level: 'beginner',
        is_published: true,
        duration_minutes: 360,
        enrollment_count: 2100,
        academy_id: 1,
        created_at: '2023-12-01T10:00:00Z',
        updated_at: '2023-12-01T10:00:00Z'
      }
    }
  ],
  learning_progress: [
    {
      course_id: 1,
      course_title: 'Introduction to React',
      progress_percentage: 75,
      completed_lessons: 15,
      total_lessons: 20,
      last_accessed: '2024-03-08T10:00:00Z',
      estimated_completion: '2024-03-15T10:00:00Z'
    },
    {
      course_id: 3,
      course_title: 'Advanced TypeScript',
      progress_percentage: 45,
      completed_lessons: 9,
      total_lessons: 20,
      last_accessed: '2024-03-07T10:00:00Z',
      estimated_completion: '2024-03-25T10:00:00Z'
    }
  ],
  upcoming_lessons: [],
  recommendations: []
}

export function StudentDashboard({ user, academy }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadDashboardData = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDashboardData(mockStudentData)
      setLoading(false)
    }

    loadDashboardData()
  }, [user, academy])

  const handleContinueCourse = (courseId: number) => {
    console.log('Continue course:', courseId)
    // Navigate to course content
  }

  const handleViewCertificate = (courseId: number) => {
    console.log('View certificate for course:', courseId)
    // Navigate to certificate view
  }

  const handleDownloadCertificate = (certificateId: number) => {
    console.log('Download certificate:', certificateId)
    // Download certificate PDF
  }

  const handleVerifyCertificate = (certificateNumber: string) => {
    console.log('Verify certificate:', certificateNumber)
    // Open verification page
  }

  if (!user) return null

  return (
    <DashboardLayout
      user={user}
      academy={academy}
      variant="compact"
      dashboardType="student"
      topNavLinks={topNavLinks}
      showConfigDrawer={false}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Learning</h1>
          <p className="text-muted-foreground">
            Continue your learning journey and track your progress
          </p>
        </div>
        
        {/* Learning Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsWidget
            title="Enrolled Courses"
            value={dashboardData?.stats.total_enrollments || 0}
            icon={BookOpen}
            loading={loading}
            description="Active and completed courses"
          />
          
          <StatsWidget
            title="Completed Courses"
            value={dashboardData?.stats.completed_courses || 0}
            change={15}
            changeType="increase"
            icon={GraduationCap}
            loading={loading}
            description="Successfully finished courses"
          />
          
          <StatsWidget
            title="Certificates Earned"
            value={dashboardData?.stats.certificates_earned || 0}
            icon={Award}
            loading={loading}
            description="Achievement certificates"
          />
          
          <StatsWidget
            title="Study Streak"
            value={`${dashboardData?.stats.study_streak_days || 0} days`}
            change={12}
            changeType="increase"
            icon={TrendingUp}
            loading={loading}
            description="Consecutive learning days"
          />
        </div>
        
        {/* My Courses Section */}
        <MyCourses
          enrollments={dashboardData?.enrollments || []}
          loading={loading}
          onContinueCourse={handleContinueCourse}
          onViewCertificate={handleViewCertificate}
        />
        
        {/* Learning Progress Section */}
        <LearningProgress
          progressData={dashboardData?.learning_progress || []}
          stats={dashboardData?.stats || {
            total_enrollments: 0,
            completed_courses: 0,
            certificates_earned: 0,
            study_streak_days: 0,
            total_study_hours: 0,
            average_progress: 0
          }}
          loading={loading}
        />
        
        {/* Certificates Section */}
        <Certificates
          certificates={dashboardData?.certificates || []}
          loading={loading}
          onDownloadCertificate={handleDownloadCertificate}
          onViewCertificate={handleViewCertificate}
          onVerifyCertificate={handleVerifyCertificate}
        />
      </div>
    </DashboardLayout>
  )
}