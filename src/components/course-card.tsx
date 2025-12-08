import { motion } from 'framer-motion'
import { 
  Clock, 
  Users, 
  BookOpen, 
  Star, 
  Play,
  Lock,
  Award
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type Course } from '@/services/academy'

interface CourseCardProps {
  course: Course
  index?: number
  academySlug: string
}

export function CourseCard({ course, index = 0 }: Omit<CourseCardProps, 'academySlug'>) {
  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        delay: index * 0.1
      }
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Principiante'
      case 'intermediate': return 'Intermedio'
      case 'advanced': return 'Avanzado'
      default: return 'Todos los niveles'
    }
  }

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price)
    return numPrice === 0 ? 'Gratis' : `$${numPrice.toLocaleString()}`
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Course Image */}
            <div className="relative lg:w-80 h-48 lg:h-40 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center overflow-hidden">
              {course.image_url ? (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <BookOpen className="w-16 h-16 text-muted-foreground" />
              )}
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3">
                  <Play className="w-6 h-6 text-black" />
                </div>
              </div>

              {/* Course Level Badge */}
              <div className="absolute top-3 right-3">
                <Badge className={getLevelColor(course.level)}>
                  {getLevelText(course.level)}
                </Badge>
              </div>

              {/* Published Status */}
              {!course.is_published && (
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="bg-white/90">
                    <Lock className="w-3 h-3 mr-1" />
                    Próximamente
                  </Badge>
                </div>
              )}
            </div>

            {/* Course Content */}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-foreground">{course.instructor_name}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right ml-4">
                  {course.discount_price ? (
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(course.discount_price)}
                      </div>
                      <div className="text-sm text-muted-foreground line-through">
                        {formatPrice(course.price)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-lg font-bold text-foreground">
                      {formatPrice(course.price)}
                    </div>
                  )}
                </div>
              </div>

              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration_weeks} semanas</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons_count} lecciones</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students_count.toLocaleString()} estudiantes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                  <span>{course.rating} ({course.reviews_count})</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button 
                  className="flex-1"
                  disabled={!course.is_published}
                >
                  {course.is_published ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Comenzar Curso
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Próximamente
                    </>
                  )}
                </Button>
                
                {course.is_published && (
                  <Button variant="outline" size="sm">
                    Vista Previa
                  </Button>
                )}
              </div>

              {/* Progress Bar for enrolled courses (placeholder) */}
              {course.is_published && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progreso del curso</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}