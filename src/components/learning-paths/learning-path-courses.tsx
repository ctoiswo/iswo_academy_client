import { Book, Clock, Users } from 'lucide-react'

import { type LearningPath } from '@/services'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface LearningPathCoursesProps {
  learningPath: LearningPath
}

export function LearningPathCourses({ learningPath }: LearningPathCoursesProps) {
  const assignedCourses = learningPath.courses || []

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Beginner</Badge>
      case 'intermediate':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Intermediate</Badge>
      case 'advanced':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Advanced</Badge>
      default:
        return <Badge variant="outline">{difficulty}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Courses in Learning Path</h2>
          <p className="text-sm text-gray-600">{assignedCourses.length} course{assignedCourses.length !== 1 ? 's' : ''} in this path</p>
        </div>
      </div>

      {/* Assigned Courses */}
      {assignedCourses.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <Book className="mx-auto h-8 w-8 text-gray-400 mb-3" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">No courses assigned</h3>
          <p className="text-sm text-gray-500">This learning path doesn't have any courses yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {assignedCourses.map((course, index) => (
            <Card key={course.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <h4 className="font-medium">{course.title}</h4>
                      {getDifficultyBadge(course.difficulty_level)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.round(course.duration_minutes / 60)}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollment_count} students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}