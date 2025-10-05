import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  Search,
  BookOpen,
  Users,
  Star,
  Clock,
  ArrowRight,
  Play,
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
import { Input } from '@/components/ui/input'
import { PublicHeader } from '@/components/layout/public-header'

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock data - esto vendría del backend
  const featuredAcademies = [
    {
      id: 1,
      name: 'Academia de Marketing Digital',
      slug: 'marketing-digital-pro',
      description:
        'Aprende las estrategias más efectivas del marketing digital moderno',
      instructor: 'María González',
      students: 1250,
      rating: 4.8,
      courses: 12,
      image:
        'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
      category: 'Marketing',
    },
    {
      id: 2,
      name: 'Escuela de Programación Web',
      slug: 'programacion-web-fullstack',
      description: 'Conviértete en desarrollador Full Stack desde cero',
      instructor: 'Carlos Mendoza',
      students: 2100,
      rating: 4.9,
      courses: 18,
      image:
        'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
      category: 'Tecnología',
    },
    {
      id: 3,
      name: 'Instituto de Diseño UX/UI',
      slug: 'diseno-ux-ui-profesional',
      description: 'Diseña experiencias digitales que cautiven a los usuarios',
      instructor: 'Ana Rodríguez',
      students: 890,
      rating: 4.7,
      courses: 8,
      image:
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
      category: 'Diseño',
    },
  ]

  const popularCourses = [
    {
      id: 1,
      title: 'React y Next.js: Desarrollo Moderno',
      academy: 'Escuela de Programación Web',
      academySlug: 'programacion-web-fullstack',
      instructor: 'Carlos Mendoza',
      duration: '8 semanas',
      students: 456,
      rating: 4.9,
      price: '$99',
      image:
        'https://images.pexels.com/photos/574077/pexels-photo-574077.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
      level: 'Intermedio',
    },
    {
      id: 2,
      title: 'Fundamentos de Marketing Digital',
      academy: 'Academia de Marketing Digital',
      academySlug: 'marketing-digital-pro',
      instructor: 'María González',
      duration: '6 semanas',
      students: 789,
      rating: 4.8,
      price: '$79',
      image:
        'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
      level: 'Principiante',
    },
    {
      id: 3,
      title: 'Diseño de Interfaces Modernas',
      academy: 'Instituto de Diseño UX/UI',
      academySlug: 'diseno-ux-ui-profesional',
      instructor: 'Ana Rodríguez',
      duration: '10 semanas',
      students: 334,
      rating: 4.7,
      price: '$129',
      image:
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=2',
      level: 'Intermedio',
    },
  ]

  const categories = [
    { id: 'all', name: 'Todas las categorías' },
    { id: 'tecnologia', name: 'Tecnología' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'diseno', name: 'Diseño' },
    { id: 'negocios', name: 'Negocios' },
    { id: 'idiomas', name: 'Idiomas' },
  ]

  return (
    <div className='bg-background min-h-screen'>
      <PublicHeader />

      {/* Hero Section */}
      <section className='relative overflow-hidden py-20 lg:py-32'>
        <div className='absolute inset-0 z-0'>
          <img
            src='https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            alt='Estudiantes aprendiendo'
            className='h-full w-full object-cover opacity-10'
          />
          <div className='from-background/80 to-background/60 absolute inset-0 bg-gradient-to-br' />
        </div>

        <div className='relative z-10 container'>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.h1
              className='text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Descubre tu próxima
              <span className='text-primary'> oportunidad de aprendizaje</span>
            </motion.h1>

            <motion.p
              className='text-muted-foreground mt-6 text-lg leading-8 sm:text-xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explora miles de cursos creados por expertos en academias
              especializadas. Aprende nuevas habilidades y haz crecer tu carrera
              profesional.
            </motion.p>

            <motion.div
              className='mx-auto mt-10 max-w-2xl'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className='flex gap-4'>
                <div className='relative flex-1'>
                  <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                  <Input
                    type='text'
                    placeholder='¿Qué quieres aprender hoy?'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='h-12 pl-10 text-lg'
                  />
                </div>
                <Button size='lg' className='h-12 px-8'>
                  <Search className='mr-2 h-4 w-4' />
                  Buscar
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className='bg-muted/50 border-b py-12'>
        <div className='container'>
          <div className='flex flex-wrap justify-center gap-4'>
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-6 py-3 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted border'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Academies */}
      <section className='py-20'>
        <div className='container'>
          <motion.div
            className='mb-16 text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Academias Destacadas
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Descubre las mejores academias especializadas en diferentes áreas
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {featuredAcademies.map((academy, index) => (
              <motion.div
                key={academy.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className='group h-full cursor-pointer overflow-hidden'>
                  <div className='relative'>
                    <img
                      src={academy.image}
                      alt={academy.name}
                      className='h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    <div className='absolute top-4 left-4'>
                      <Badge variant='secondary'>{academy.category}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className='line-clamp-1'>
                      {academy.name}
                    </CardTitle>
                    <CardDescription className='line-clamp-2'>
                      {academy.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>
                          Por {academy.instructor}
                        </span>
                        <div className='flex items-center space-x-1'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span className='font-medium'>{academy.rating}</span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center space-x-4'>
                          <div className='flex items-center space-x-1'>
                            <Users className='text-muted-foreground h-4 w-4' />
                            <span>{academy.students.toLocaleString()}</span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <BookOpen className='text-muted-foreground h-4 w-4' />
                            <span>{academy.courses} cursos</span>
                          </div>
                        </div>
                      </div>
                      <Button asChild className='w-full'>
                        <Link to='/academies'>
                          Explorar Academia
                          <ArrowRight className='ml-2 h-4 w-4' />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className='bg-muted/50 py-20'>
        <div className='container'>
          <motion.div
            className='mb-16 text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              Cursos Populares
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Los cursos más elegidos por nuestra comunidad de estudiantes
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {popularCourses.map((course, index) => (
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
                  </div>
                  <CardHeader>
                    <CardTitle className='line-clamp-1'>
                      {course.title}
                    </CardTitle>
                    <CardDescription className='line-clamp-1'>
                      {course.academy}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>
                          Por {course.instructor}
                        </span>
                        <div className='flex items-center space-x-1'>
                          <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                          <span className='font-medium'>{course.rating}</span>
                        </div>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <div className='flex items-center space-x-4'>
                          <div className='flex items-center space-x-1'>
                            <Clock className='text-muted-foreground h-4 w-4' />
                            <span>{course.duration}</span>
                          </div>
                          <div className='flex items-center space-x-1'>
                            <Users className='text-muted-foreground h-4 w-4' />
                            <span>{course.students}</span>
                          </div>
                        </div>
                      </div>
                      <Button asChild className='w-full'>
                        <Link to='/academies'>
                          Ver Curso
                          <Play className='ml-2 h-4 w-4' />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Creators */}
      <section className='bg-primary/5 border-t py-20'>
        <div className='container'>
          <motion.div
            className='mx-auto max-w-4xl text-center'
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl font-bold tracking-tight sm:text-4xl'>
              ¿Tienes conocimiento que compartir?
            </h2>
            <p className='text-muted-foreground mt-6 text-lg leading-8'>
              Únete a miles de instructores que ya están creando sus propias
              academias en línea. Comparte tu experiencia y genera ingresos
              enseñando lo que más te apasiona.
            </p>
            <div className='mt-10'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size='lg' asChild>
                  <Link to='/landing'>
                    Crear mi Academia
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Simple */}
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
