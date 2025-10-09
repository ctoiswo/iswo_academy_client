import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, Filter, Grid, List, Search, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

import { useUserEnrollments } from '@/hooks/use-enrollments'
import { type EnrollmentFilters, type Enrollment } from '@/services/enrollment-service'

export default function MyCoursesPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<EnrollmentFilters>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data: enrollmentsData, isLoading, error } = useUserEnrollments(filters)

  const handleFilterChange = (status: string) => {
    setFilters({
      ...filters,
      status: status === 'all' ? undefined : status as any
    })
  }

  const handleContinueCourse = (courseSlug: string) => {
    navigate({ to: `/courses/${courseSlug}` })
  }

  const handleViewCertificate = (enrollmentId: number) => {
    navigate({ to: `/certificates/${enrollmentId}` })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${remainingMinutes}m`
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-bold text-red-600 mb-2">Error Loading Courses</h3>
          <p className="text-gray-600">Failed to load your courses. Please try again.</p>
        </div>
      </div>
    )
  }

  const enrollments: Enrollment[] = Array.isArray(enrollmentsData) 
    ? enrollmentsData 
    : enrollmentsData?.enrollments || []

  // Filter by search query
  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.course.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Track your learning progress and continue where you left off
          </p>
        </div>
        <Button onClick={() => navigate({ to: '/redeem-code' })}>
          <Plus className="w-4 h-4 mr-2" />
          Redeem Access Code
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filters.status || 'all'} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[150px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Grid/List */}
      {filteredEnrollments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filters.status 
                ? "No courses match your current filters." 
                : "You haven't enrolled in any courses yet."}
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate({ to: '/courses' })}>
                Browse Courses
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/redeem-code' })}>
                Redeem Access Code
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
          : "space-y-4"
        }>
          {filteredEnrollments.map((enrollment) => (
            <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg leading-tight">
                      {enrollment.course.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(enrollment.status)}>
                        {enrollment.status}
                      </Badge>
                      <Badge variant="outline" className={getDifficultyColor(enrollment.course.difficulty_level)}>
                        {enrollment.course.difficulty_level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-2">
                  {enrollment.course.description}
                </CardDescription>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{enrollment.progress_percentage || 0}%</span>
                  </div>
                  <Progress value={enrollment.progress_percentage || 0} className="h-2" />
                </div>
                
                {/* Course Info */}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Duration: {formatDuration(enrollment.course.duration_minutes)}</span>
                  <span>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {enrollment.status === 'completed' ? (
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewCertificate(enrollment.id)}
                      className="flex-1"
                    >
                      View Certificate
                    </Button>
                  ) : (
                    <Button 
                      size="sm"
                      onClick={() => handleContinueCourse(enrollment.course.slug)}
                      className="flex-1"
                    >
                      Continue Learning
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate({ to: `/courses/${enrollment.course.slug}` })}
                  >
                    View Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}