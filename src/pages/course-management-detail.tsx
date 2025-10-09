import { useState } from 'react'
import { useParams, Link } from '@tanstack/react-router'
import { 
  ArrowLeft, 
  BookOpen, 
  Award, 
  CheckSquare, 
  Users, 
  Settings,
  Plus,
  PlayCircle,
  Clock,
  Target,
  Key,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  Ticket
} from 'lucide-react'

import { useCourse } from '@/hooks/use-courses'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { AccessCodeList } from '@/components/access-codes/access-code-list'

export default function CourseManagementDetailPage() {
  const { courseId } = useParams({ from: '/_authenticated/admin/courses/$courseId/manage/' })
  
  // Fetch course data
  const { data: course, isLoading, error } = useCourse(courseId)

  // Tab state
  const [activeTab, setActiveTab] = useState('lessons')

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-bold text-red-600 mb-2">Error Loading Course</h3>
          <p className="text-gray-600">Course not found or you don't have permission to access it</p>
          <Link to="/admin/courses" className="mt-4 inline-block">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/admin/courses">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex gap-2">
              <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                {course.status}
              </Badge>
              <Badge variant="outline">{course.difficulty_level}</Badge>
              <Badge variant="outline" className="text-green-600">
                {course.is_free ? 'Free' : `$${course.price}`}
              </Badge>
            </div>
          </div>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Course Settings
          </Button>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">{course.enrollment_count || 0}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PlayCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-2xl font-bold">{course.lessons_count || 0}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-orange-600 mr-2" />
              <span className="text-2xl font-bold">
                {Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}m
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-2xl font-bold">{course.sections_count || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="lessons">
            <PlayCircle className="w-4 h-4 mr-2" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <CheckSquare className="w-4 h-4 mr-2" />
            Assignments
          </TabsTrigger>
          <TabsTrigger value="certificates">
            <Award className="w-4 h-4 mr-2" />
            Certificates
          </TabsTrigger>
          <TabsTrigger value="students">
            <Users className="w-4 h-4 mr-2" />
            Students
          </TabsTrigger>
          <TabsTrigger value="access-codes">
            <Settings className="w-4 h-4 mr-2" />
            Access Codes
          </TabsTrigger>
        </TabsList>

        {/* Lessons Tab */}
        <TabsContent value="lessons">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Course Lessons</CardTitle>
                  <CardDescription>
                    Manage lessons, sections, and course content
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <PlayCircle className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">No lessons yet</h3>
                <p className="mb-4">Start building your course by adding lessons and sections</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Lesson
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Course Assignments</CardTitle>
                  <CardDescription>
                    Create and manage assignments, quizzes, and projects
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Assignment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <CheckSquare className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">No assignments yet</h3>
                <p className="mb-4">Add assignments to evaluate student progress</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Course Certificates</CardTitle>
                  <CardDescription>
                    Configure completion certificates and requirements
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Configure Certificate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Award className="mx-auto h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium mb-2">No certificate configured</h3>
                <p className="mb-4">Set up completion certificates for students who finish the course</p>
                <Button>
                  <Award className="w-4 h-4 mr-2" />
                  Setup Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Enrolled Students</CardTitle>
                  <CardDescription>
                    View and manage students enrolled in this course
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {course.enrollment_count === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No students enrolled</h3>
                  <p className="mb-4">Students will appear here once they enroll in the course</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    {course.enrollment_count} student{course.enrollment_count !== 1 ? 's' : ''} enrolled
                  </p>
                  {/* TODO: Add student list component */}
                  <div className="text-center py-8 text-gray-500">
                    <p>Student management interface coming soon...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Access Codes Tab */}
        <TabsContent value="access-codes">
          <AccessCodeList courseId={course.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}