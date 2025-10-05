import { Link, useParams } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Users,
  BookOpen,
  Star,
  Clock,
  Play,
  ArrowLeft,
  Heart,
  Share2,
  Award,
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

export function PublicAcademyPage() {
  const { academySlug } = useParams({ strict: false })

  // Mock data - esto vendría del backend basado en el slug
  const academy = {
    id: 1,
    name: 'Academia de Marketing Digital Pro',
    slug: 'marketing-digital-pro',
    description:
      'La academia más completa para dominar el marketing digital. Aprende desde los fundamentos hasta las estrategias más avanzadas con instructores expertos y casos reales.',
    instructor: {
      name: 'María González',
      bio: 'Especialista en Marketing Digital con más de 10 años de experiencia. Ha trabajado con marcas reconocidas y ha formado a más de 5,000 estudiantes.',
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    },
    students: 1250,
    rating: 4.8,
    totalRatings: 234,
    coursesCount: 12,
    image:
      'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=2',
    category: 'Marketing Digital',
    tags: ['SEO', 'SEM', 'Redes Sociales', 'Email Marketing', 'Analytics'],
    createdAt: '2023',
    totalHours: 45,
  }

  const courses = [
    {
      id: 1,
      title: 'Fundamentos de Marketing Digital',
      description:
        'Aprende los conceptos básicos y fundamentales del marketing digital moderno',
      duration: '8 semanas',
      lessons: 24,
      students: 456,
      rating: 4.9,
      price: '$99',
      level: 'Principiante',
      image:
        'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    },
    {
      id: 2,
      title: 'SEO Avanzado para Profesionales',
      description: 'Estrategias avanzadas de posicionamiento en buscadores',
      duration: '10 semanas',
      lessons: 32,
      students: 234,
      rating: 4.8,
      price: '$149',
      level: 'Avanzado',
      image:
        'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    },
    {
      id: 3,
      title: 'Publicidad en Redes Sociales',
      description:
        'Domina Facebook Ads, Instagram Ads y otras plataformas publicitarias',
      duration: '6 semanas',
      lessons: 18,
      students: 567,
      rating: 4.7,
      price: '$129',
      level: 'Intermedio',
      image:
        'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
    },
  ]

  return (
    <div className='bg-background min-h-screen'>
      {/* Header */}
      <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur'>
        <div className='container flex h-16 items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <Button variant='ghost' size='sm' asChild>
              <Link to='/'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Volver al inicio
              </Link>
            </Button>
          </div>

          <motion.div
            className='flex items-center space-x-2'
            whileHover={{ scale: 1.05 }}
          >
            <GraduationCap className='text-primary h-6 w-6' />
            <span className='font-bold'>ISWO Academy</span>
          </motion.div>

          <div className='flex items-center space-x-4'>
            <Button variant='ghost' asChild>
              <Link to='/sign-in'>Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link to='/sign-up'>Registrarse</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero de la Academia */}
      <section className='relative overflow-hidden'>
        <div className='absolute inset-0'>
          <img
            src={academy.image}
            alt={academy.name}
            className='h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-black/60' />
        </div>

        <div className='relative z-10 container py-20 lg:py-32'>
          <div className='max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant='secondary' className='mb-4'>
                {academy.category}
              </Badge>

              <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl'>
                {academy.name}
              </h1>

              <p className='mt-6 max-w-3xl text-lg leading-8 text-gray-200 sm:text-xl'>
                {academy.description}
              </p>

              <div className='mt-8 flex flex-wrap items-center gap-6 text-white'>
                <div className='flex items-center space-x-2'>
                  <img
                    src={academy.instructor.avatar}
                    alt={academy.instructor.name}
                    className='h-10 w-10 rounded-full'
                  />
                  <div>
                    <p className='font-medium'>Por {academy.instructor.name}</p>
                  </div>
                </div>

                <div className='flex items-center space-x-1'>
                  <Star className='h-5 w-5 fill-yellow-400 text-yellow-400' />
                  <span className='font-medium'>{academy.rating}</span>
                  <span className='text-gray-300'>
                    ({academy.totalRatings} reseñas)
                  </span>
                </div>

                <div className='flex items-center space-x-1'>
                  <Users className='h-5 w-5' />
                  <span>{academy.students.toLocaleString()} estudiantes</span>
                </div>

                <div className='flex items-center space-x-1'>
                  <BookOpen className='h-5 w-5' />
                  <span>{academy.coursesCount} cursos</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Información de la Academia */}
      <section className='border-b py-16'>
        <div className='container'>
          <div className='grid gap-12 lg:grid-cols-3'>
            {/* Información principal */}
            <div className='space-y-8 lg:col-span-2'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className='mb-4 text-2xl font-bold'>Sobre esta academia</h2>
                <p className='text-muted-foreground leading-relaxed'>
                  {academy.description}
                </p>

                <div className='mt-6 flex flex-wrap gap-2'>
                  {academy.tags.map((tag, index) => (
                    <Badge key={index} variant='outline'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className='mb-6 text-2xl font-bold'>
                  Conoce a tu instructor
                </h2>
                <div className='flex items-start space-x-4'>
                  <img
                    src={academy.instructor.avatar}
                    alt={academy.instructor.name}
                    className='h-16 w-16 rounded-full'
                  />
                  <div>
                    <h3 className='text-xl font-semibold'>
                      {academy.instructor.name}
                    </h3>
                    <p className='text-muted-foreground mt-2 leading-relaxed'>
                      {academy.instructor.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar con estadísticas */}
            <div className='space-y-6'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Esta academia incluye</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Clock className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Contenido total</span>
                      </div>
                      <span className='font-medium'>
                        {academy.totalHours} horas
                      </span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <BookOpen className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Cursos</span>
                      </div>
                      <span className='font-medium'>
                        {academy.coursesCount}
                      </span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Users className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Estudiantes</span>
                      </div>
                      <span className='font-medium'>
                        {academy.students.toLocaleString()}
                      </span>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Award className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Certificado</span>
                      </div>
                      <span className='font-medium'>Incluido</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className='flex space-x-2'>
                <Button variant='outline' size='sm' className='flex-1'>
                  <Heart className='mr-2 h-4 w-4' />
                  Guardar
                </Button>
                <Button variant='outline' size='sm' className='flex-1'>
                  <Share2 className='mr-2 h-4 w-4' />
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos de la Academia */}
      <section className='py-16'>
        <div className='container'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='mb-12 text-center'
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Cursos disponibles ({courses.length})
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Explora todo el contenido disponible en esta academia
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className='group h-full cursor-pointer overflow-hidden'>
                  <div className='relative'>
                    <img
                      src={course.image}
                      alt={course.title}
                      className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    <div className='absolute top-4 left-4'>
                      <Badge>{course.level}</Badge>
                    </div>
                    <div className='absolute top-4 right-4'>
                      <div className='rounded bg-black/70 px-2 py-1 text-sm font-medium text-white'>
                        {course.price}
                      </div>
                    </div>
                    <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20'>
                      <Play className='h-12 w-12 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className='line-clamp-2'>
                      {course.title}
                    </CardTitle>
                    <CardDescription className='line-clamp-2'>
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center space-x-4'>
                          <div className='flex items-center space-x-1'>
                            <Clock className='text-muted-foreground h-4 w-4' />
                            <span>{course.duration}</span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <BookOpen className='text-muted-foreground h-4 w-4' />
                            <span>{course.lessons} lecciones</span>
                          </div>
                        </div>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center space-x-1'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span className='font-medium'>{course.rating}</span>
                        </div>
                        <div className='flex items-center space-x-1'>
                          <Users className='text-muted-foreground h-4 w-4' />
                          <span>{course.students} estudiantes</span>
                        </div>
                      </div>
                      <Button className='w-full'>
                        Ver detalles del curso
                        <Play className='ml-2 h-4 w-4' />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className='bg-muted/50 border-t'>
        <div className='container py-8'>
          <div className='flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0'>
            <div className='flex items-center space-x-2'>
              <GraduationCap className='text-primary h-6 w-6' />
              <span className='font-bold'>ISWO Academy</span>
            </div>
            <p className='text-muted-foreground text-sm'>
              © 2025 ISWO Academy. Todos los derechos reservados.
            </p>
            <div className='flex items-center space-x-4'>
              <Button size='sm' variant='ghost' asChild>
                <Link to='/sign-in'>Iniciar Sesión</Link>
              </Button>
              <Button size='sm' asChild>
                <Link to='/sign-up'>Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
