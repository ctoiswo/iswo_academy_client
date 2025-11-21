import { useParams, useRouter } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Star, 
  Users, 
  BookOpen, 
  Clock, 
  Share2,
  Heart,
  ShoppingCart,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAcademy } from '@/hooks/use-academy.ts'
import { PublicHeader } from '@/components/layout/public-header.tsx'
import { CourseCard } from '@/components/course-card.tsx'
import { Link } from '@tanstack/react-router'

export function AcademyDetailPage() {
  const { slug } = useParams({ from: '/academies/$slug' })
  const router = useRouter()
  const { academy, loading, error } = useAcademy(slug)

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
            />
            <p className="mt-4 text-muted-foreground">Cargando academia...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !academy) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader />
        <div className="container mx-auto px-4 py-8">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600">Academia no encontrada</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {error || 'La academia que buscas no existe o no está disponible.'}
              </p>
              <Button asChild className="w-full">
                <Link to="/academies">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Academias
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        {/* Hero Banner */}
        <motion.div 
          variants={sectionVariants}
          className="relative h-96 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-grid-white/10" />
          
          {/* Banner Image */}
          {academy.banner_url && (
            <img
              src={academy.banner_url}
              alt={`${academy.name} banner`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Overlay Content */}
          <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
            <div className="flex items-end gap-6 w-full">
              {/* Academy Logo */}
              <motion.div
                variants={sectionVariants}
                className="flex-shrink-0"
              >
                <div className="w-32 h-32 bg-background rounded-2xl shadow-xl border-4 border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  {academy.logo_url ? (
                    <img
                      src={academy.logo_url}
                      alt={`${academy.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-16 h-16 text-muted-foreground" />
                  )}
                </div>
              </motion.div>

              {/* Academy Info */}
              <motion.div variants={sectionVariants} className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    {academy.category.name}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="font-semibold">{academy.rating}</span>
                    <span className="text-white/80">({academy.reviews_count} reseñas)</span>
                  </div>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-3">{academy.name}</h1>
                
                <p className="text-lg text-white/90 mb-4 max-w-2xl">
                  {academy.description}
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{(academy.enrolled_users_count || 0).toLocaleString()} estudiantes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{academy.courses_count || 0} cursos</span>
                  </div>
                  {academy.total_duration_hours && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{academy.total_duration_hours}h de contenido</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={sectionVariants} className="flex flex-col gap-3">
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Suscribirse ${academy.monthly_price || 0}/mes
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.history.back()}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <motion.div variants={sectionVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      Acerca de esta Academia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {academy.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Courses Section */}
              <motion.div variants={sectionVariants}>
                <Tabs defaultValue="courses" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="courses">Cursos ({academy.courses_count || 0})</TabsTrigger>
                    <TabsTrigger value="reviews">Reseñas ({academy.reviews_count || 0})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="courses" className="space-y-4">
                    {academy.courses && academy.courses.length > 0 ? (
                      <div className="grid gap-6">
                        {academy.courses.map((course, index) => (
                          <CourseCard 
                            key={course.id} 
                            course={course} 
                            index={index}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="text-center py-12">
                          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Próximamente</h3>
                          <p className="text-muted-foreground">
                            Esta academia está preparando contenido increíble. ¡Mantente atento!
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="space-y-4">
                    <Card>
                      <CardContent className="text-center py-12">
                        <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Reseñas próximamente</h3>
                        <p className="text-muted-foreground">
                          Las reseñas de estudiantes estarán disponibles pronto.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Instructor Card */}
              <motion.div variants={sectionVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={academy.creator.avatar_url} />
                        <AvatarFallback>
                          {academy.creator.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{academy.creator.name}</h3>
                        <p className="text-sm text-muted-foreground">Creador de la Academia</p>
                      </div>
                    </div>
                    {academy.creator.bio && (
                      <p className="text-sm text-muted-foreground">{academy.creator.bio}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Card */}
              <motion.div variants={sectionVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Estudiantes</span>
                      <span className="font-semibold">{(academy.enrolled_users_count || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Cursos</span>
                      <span className="font-semibold">{academy.courses_count || 0}</span>
                    </div>
                    {academy.total_lessons && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Lecciones</span>
                        <span className="font-semibold">{academy.total_lessons}</span>
                      </div>
                    )}
                    {academy.total_duration_hours && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Duración total</span>
                        <span className="font-semibold">{academy.total_duration_hours}h</span>
                      </div>
                    )}
                    {(academy.rating || academy.total_lessons || academy.total_duration_hours) && <Separator />}
                    {academy.rating && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Calificación</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                          <span className="font-semibold">{academy.rating}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Subscription Card */}
              <motion.div variants={sectionVariants}>
                <Card className="border-2 border-blue-200 bg-blue-50/50">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold mb-2">Acceso Completo</h3>
                      <div className="text-3xl font-bold text-blue-600">
                        ${academy.monthly_price || 0}
                        <span className="text-lg font-normal text-muted-foreground">/mes</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Acceso a todos los cursos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Nuevos cursos cada mes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Certificados al completar</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Soporte del instructor</span>
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Suscribirse Ahora
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}