import { motion } from 'framer-motion'
import { Star, Users, BookOpen, Award, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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
      <Card className='overflow-hidden'>
        <CardHeader className='from-primary/5 bg-gradient-to-r to-transparent'>
          <CardTitle className='flex items-center gap-2'>
            <Award className='text-primary h-5 w-5' />
            Tu instructor
          </CardTitle>
        </CardHeader>
        <CardContent className='p-6'>
          <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
            {/* Instructor Avatar */}
            <div className='flex-shrink-0'>
              <div className='relative'>
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className='border-primary/10 h-24 w-24 rounded-full border-4 object-cover shadow-lg sm:h-28 sm:w-28'
                />
                <div className='border-background absolute -right-2 -bottom-2 flex h-10 w-10 items-center justify-center rounded-full border-4 bg-yellow-500 text-white shadow-lg'>
                  <Star className='h-5 w-5 fill-current' />
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className='flex-1 space-y-3'>
              <div>
                <h4 className='mb-2 text-2xl font-bold'>{instructor.name}</h4>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {instructor.bio}
                </p>
              </div>

              <Separator />

              {/* Stats Grid */}
              <div className='grid grid-cols-3 gap-4 py-2'>
                <div className='text-center'>
                  <div className='mb-1 flex items-center justify-center'>
                    <Star className='h-5 w-5 fill-yellow-500 text-yellow-500' />
                  </div>
                  <div className='text-xl font-bold'>{instructor.rating}</div>
                  <div className='text-muted-foreground text-xs'>Rating</div>
                </div>
                <div className='text-center'>
                  <div className='mb-1 flex items-center justify-center'>
                    <Users className='text-primary h-5 w-5' />
                  </div>
                  <div className='text-xl font-bold'>
                    {(instructor.students / 1000).toFixed(1)}K
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    Estudiantes
                  </div>
                </div>
                <div className='text-center'>
                  <div className='mb-1 flex items-center justify-center'>
                    <BookOpen className='text-primary h-5 w-5' />
                  </div>
                  <div className='text-xl font-bold'>{instructor.courses}</div>
                  <div className='text-muted-foreground text-xs'>Cursos</div>
                </div>
              </div>

              <Separator />

              {/* CTA Button */}
              <Button variant='outline' className='w-full sm:w-auto'>
                <MessageSquare className='mr-2 h-4 w-4' />
                Ver perfil completo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
