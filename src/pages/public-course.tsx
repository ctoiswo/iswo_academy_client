import { Link, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  Play,
  BookOpen,
  Award,
  Globe,
  Download,
  Share2,
  Heart
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PublicHeader } from '@/components/layout/public-header'

export function PublicCoursePage() {
  const { courseSlug } = useParams({ strict: false })

  // Mock data - esto vendría del backend basado en el slug
  const course = {
    id: 4,
    title: 'Fundamentos de UX/UI Design',
    slug: 'fundamentos-de-uxui-design-4',
    description: 'Aprende los principios fundamentales del diseño de experiencia de usuario e interfaces. Desde la investigación hasta el prototipado, domina las herramientas y metodologías más importantes del UX/UI Design.',
    longDescription: `
      Este curso completo te llevará desde los conceptos básicos hasta técnicas avanzadas de UX/UI Design. 
      
      Aprenderás a:
      • Realizar investigación de usuarios efectiva
      • Crear wireframes y prototipos funcionales  
      • Diseñar interfaces atractivas y usables
      • Utilizar herramientas profesionales como Figma y Adobe XD
      • Aplicar principios de psicología del color y tipografía
      • Realizar testing de usabilidad
      
      Al finalizar serás capaz de crear experiencias digitales completas y profesionales.
    `,
    instructor: {
      name: 'Ana Martínez',
      bio: 'Diseñadora UX/UI Senior con más de 8 años de experiencia en empresas tecnológicas. Ha trabajado en startups y corporaciones, diseñando productos usados por millones de usuarios.',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4.9,
      courses: 12,
      students: 15000
    },
    thumbnail_url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=2',
    price: '2500',
    is_free: false,
    difficulty_level: 'intermediate',
    duration_minutes: 1800, // 30 horas
    enrollment_count: 3245,
    rating: 4.8,
    total_ratings: 892,
    is_published: true,
    created_at: '2024',
    category: 'Arte y Diseño',
    tags: ['UX Design', 'UI Design', 'Figma', 'Prototipado', 'Investigación UX'],
    requirements: [
      'Conocimientos básicos de computación',
      'Ganas de aprender diseño',
      'No se requiere experiencia previa'
    ],
    whatYoullLearn: [
      'Principios fundamentales del UX Design',
      'Metodologías de investigación de usuarios',
      'Creación de wireframes y prototipos',
      'Diseño de interfaces modernas',
      'Uso profesional de Figma',
      'Testing de usabilidad',
      'Psicología del color y tipografía',
      'Design Systems y componentes'
    ],
    sections: [
      {
        id: 1,
        title: 'Introducción al UX/UI Design',
        lessons: 8,
        duration: 120
      },
      {
        id: 2, 
        title: 'Investigación y Análisis de Usuarios',
        lessons: 12,
        duration: 180
      },
      {
        id: 3,
        title: 'Wireframing y Prototipado',
        lessons: 15,
        duration: 240
      },
      {
        id: 4,
        title: 'Diseño Visual y UI',
        lessons: 18,
        duration: 300
      },
      {
        id: 5,
        title: 'Herramientas y Testing',
        lessons: 10,
        duration: 150
      }
    ]
  }

  const formatPrice = (priceString: string) => {
    const price = parseFloat(priceString)
    return `$${(price / 1000).toFixed(0)}k`
  }

  const formatDifficulty = (level: string) => {
    const levels = {
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado'
    }
    return levels[level as keyof typeof levels] || level
  }

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/public/courses" className="text-muted-foreground hover:text-foreground">
              Cursos
            </Link>
            <span className="text-muted-foreground">•</span>
            <span className="font-medium">{course.category}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link 
                to="/public/courses"
                className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver a cursos
              </Link>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={getDifficultyColor(course.difficulty_level)}>
                  {formatDifficulty(course.difficulty_level)}
                </Badge>
                <Badge variant="outline">{course.category}</Badge>
                {course.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>
                    Por <span className="font-medium">{course.instructor.name}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-muted-foreground">({course.total_ratings})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{course.enrollment_count.toLocaleString()} estudiantes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{Math.round(course.duration_minutes / 60)} horas</span>
                </div>
              </div>
            </motion.div>

            {/* Course Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-xl overflow-hidden"
            >
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-64 lg:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                  <Play className="w-5 h-5 mr-2" />
                  Vista previa del curso
                </Button>
              </div>
            </motion.div>

            {/* What you'll learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Lo que aprenderás
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.whatYoullLearn.map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Course Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Contenido del curso</CardTitle>
                  <CardDescription>
                    {course.sections.length} secciones • {course.sections.reduce((sum, s) => sum + s.lessons, 0)} lecciones • {Math.round(course.duration_minutes / 60)} horas de contenido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.sections.map((section, index) => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">
                          {index + 1}. {section.title}
                        </h4>
                        <div className="text-sm text-muted-foreground">
                          {section.lessons} lecciones • {Math.round(section.duration / 60)}h
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Requisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Instructor */}
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
                  <div className="flex items-start gap-4">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-lg mb-1">{course.instructor.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{course.instructor.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{course.instructor.students.toLocaleString()} estudiantes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.instructor.courses} cursos</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {course.instructor.bio}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-8"
            >
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold mb-2">
                      {course.is_free ? (
                        <span className="text-green-600">Gratis</span>
                      ) : (
                        <span>{formatPrice(course.price)}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Acceso completo de por vida
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <Button className="w-full" size="lg">
                      <Play className="w-4 h-4 mr-2" />
                      Inscribirse al curso
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Heart className="w-4 h-4 mr-1" />
                        Guardar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="w-4 h-4 mr-1" />
                        Compartir
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Nivel:</span>
                      <span>{formatDifficulty(course.difficulty_level)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duración:</span>
                      <span>{Math.round(course.duration_minutes / 60)} horas</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Lecciones:</span>
                      <span>{course.sections.reduce((sum, s) => sum + s.lessons, 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Idioma:</span>
                      <span>Español</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Acceso:</span>
                      <span>De por vida</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}