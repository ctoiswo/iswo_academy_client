import { motion } from 'framer-motion'
import { Star, Users, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CourseInstructorProps {
  instructor: {
    name: string
    bio: string
    avatar: string
    rating: number
    courses: number
    students: number
  }
}

export function CourseInstructor({ instructor }: CourseInstructorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-start gap-4'>
            <img
              src={instructor.avatar}
              alt={instructor.name}
              className='h-16 w-16 rounded-full'
            />
            <div className='flex-1'>
              <h4 className='mb-1 text-lg font-medium'>{instructor.name}</h4>
              <div className='text-muted-foreground mb-3 flex items-center gap-4 text-sm'>
                <div className='flex items-center gap-1'>
                  <Star className='h-4 w-4 fill-current text-yellow-500' />
                  <span>{instructor.rating}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Users className='h-4 w-4' />
                  <span>
                    {instructor.students.toLocaleString()} estudiantes
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <BookOpen className='h-4 w-4' />
                  <span>{instructor.courses} cursos</span>
                </div>
              </div>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {instructor.bio}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
