import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { 
  Users, 
  BookOpen, 
  Star, 
  Clock, 
  ArrowRight,
  GraduationCap 
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Academy {
  id: number
  name: string
  slug: string
  description: string
  instructor: string
  students: number
  rating: number
  courses: number
  image: string
  category: string
  duration?: string
  level?: 'Principiante' | 'Intermedio' | 'Avanzado'
  price?: number
}

interface PublicAcademyCardProps {
  academy: Academy
  index?: number
}

export function PublicAcademyCard({ academy, index = 0 }: PublicAcademyCardProps) {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  }

  const imageVariants = {
    hover: { scale: 1.05 }
  }

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Principiante': return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Avanzado': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-card group cursor-pointer">
        <Link to="/academies/$slug" params={{ slug: academy.slug }}>
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            <motion.img
              src={academy.image}
              alt={academy.name}
              className="w-full h-full object-cover"
              variants={imageVariants}
              whileHover="hover"
              transition={{ duration: 0.3 }}
            />
            
            {/* Overlay con categoria */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-white/90 text-gray-800 font-medium">
                {academy.category}
              </Badge>
            </div>

            {/* Level badge */}
            {academy.level && (
              <div className="absolute top-4 right-4">
                <Badge className={getLevelColor(academy.level)}>
                  {academy.level}
                </Badge>
              </div>
            )}

            {/* Rating overlay */}
            <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm border">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-foreground">{academy.rating}</span>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6">
            {/* Title */}
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {academy.name}
            </h3>

            {/* Description */}
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
              {academy.description}
            </p>

            {/* Instructor */}
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground font-medium">{academy.instructor}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">
                  {academy.students.toLocaleString()} estudiantes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-600" />
                <span className="text-sm text-muted-foreground">
                  {academy.courses} cursos
                </span>
              </div>
            </div>

            {/* Duration and Price */}
            <div className="flex items-center justify-between mb-4">
              {academy.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{academy.duration}</span>
                </div>
              )}
              
              {academy.price !== undefined && (
                <div className="text-right">
                  {academy.price === 0 ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Gratis
                    </Badge>
                  ) : (
                    <span className="text-lg font-bold text-foreground">
                      ${academy.price.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button className="w-full group/btn" asChild>
              <Link to="/academies/$slug" params={{ slug: academy.slug }}>
                Ver Academia
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Link>
      </Card>
    </motion.div>
  )
}