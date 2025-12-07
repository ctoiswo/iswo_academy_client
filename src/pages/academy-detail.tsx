import { useParams, useRouter } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
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
  CheckCircle,
} from 'lucide-react'
import { useAcademy } from '@/hooks/use-academy.ts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseCard } from '@/components/course-card.tsx'
import { PublicHeader } from '@/features/home/components/header'

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
        staggerChildren: 0.1,
      },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  if (loading) {
    return (
      <div className='bg-background min-h-screen'>
        <PublicHeader />
        <div className='container mx-auto px-4 py-8'>
          <div className='flex min-h-[400px] flex-col items-center justify-center'>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className='border-primary h-8 w-8 rounded-full border-4 border-t-transparent'
            />
            <p className='text-muted-foreground mt-4'>Cargando academia...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !academy) {
    return (
      <div className='bg-background min-h-screen'>
        <PublicHeader />
        <div className='container mx-auto px-4 py-8'>
          <Card className='mx-auto max-w-md'>
            <CardHeader>
              <CardTitle className='text-red-600'>
                Academia no encontrada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground mb-4'>
                {error ||
                  'La academia que buscas no existe o no está disponible.'}
              </p>
              <Button asChild className='w-full'>
                <Link to='/academies'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
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
    <div className='bg-background min-h-screen'>
      <PublicHeader />

      <motion.div
        variants={pageVariants}
        initial='hidden'
        animate='visible'
        className='relative'
      >
        {/* Hero Banner */}
        <motion.div
          variants={sectionVariants}
          className='relative h-96 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600'
        >
          {/* Background Pattern */}
          <div className='absolute inset-0 bg-black/20' />
          <div className='bg-grid-white/10 absolute inset-0' />

          {/* Banner Image */}
          {academy.banner_url && (
            <img
              src={academy.banner_url}
              alt={`${academy.name} banner`}
              className='absolute inset-0 h-full w-full object-cover'
            />
          )}

          {/* Overlay Content */}
          <div className='relative container mx-auto flex h-full items-end px-4 pb-8'>
            <div className='flex w-full items-end gap-6'>
              {/* Academy Logo */}
              <motion.div variants={sectionVariants} className='flex-shrink-0'>
                <div className='bg-background flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-4 border-white/20 shadow-xl backdrop-blur-sm'>
                  {academy.logo_url ? (
                    <img
                      src={academy.logo_url}
                      alt={`${academy.name} logo`}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <BookOpen className='text-muted-foreground h-16 w-16' />
                  )}
                </div>
              </motion.div>

              {/* Academy Info */}
              <motion.div
                variants={sectionVariants}
                className='flex-1 text-white'
              >
                <div className='mb-2 flex items-center gap-2'>
                  <Badge className='border-white/30 bg-white/20 text-white backdrop-blur-sm'>
                    {academy.category.name}
                  </Badge>
                  <div className='flex items-center gap-1'>
                    <Star className='h-4 w-4 fill-current text-yellow-400' />
                    <span className='font-semibold'>{academy.rating}</span>
                    <span className='text-white/80'>
                      ({academy.reviews_count} reseñas)
                    </span>
                  </div>
                </div>

                <h1 className='mb-3 text-4xl font-bold lg:text-5xl'>
                  {academy.name}
                </h1>

                <p className='mb-4 max-w-2xl text-lg text-white/90'>
                  {academy.description}
                </p>

                <div className='flex items-center gap-6 text-sm'>
                  <div className='flex items-center gap-2'>
                    <Users className='h-4 w-4' />
                    <span>
                      {(academy.enrolled_users_count || 0).toLocaleString()}{' '}
                      estudiantes
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <BookOpen className='h-4 w-4' />
                    <span>{academy.courses_count || 0} cursos</span>
                  </div>
                  {academy.total_duration_hours && (
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      <span>{academy.total_duration_hours}h de contenido</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                variants={sectionVariants}
                className='flex flex-col gap-3'
              >
                <Button
                  size='lg'
                  className='bg-white text-black hover:bg-white/90'
                >
                  <ShoppingCart className='mr-2 h-4 w-4' />
                  Suscribirse ${academy.monthly_price || 0}/mes
                </Button>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-white/30 bg-white/10 text-white hover:bg-white/20'
                  >
                    <Heart className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-white/30 bg-white/10 text-white hover:bg-white/20'
                  >
                    <Share2 className='h-4 w-4' />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Back Button */}
          <div className='absolute top-6 left-6'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.history.back()}
              className='border-white/30 bg-white/10 text-white hover:bg-white/20'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Volver
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className='container mx-auto px-4 py-12'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Left Column - Main Content */}
            <div className='space-y-8 lg:col-span-2'>
              {/* About Section */}
              <motion.div variants={sectionVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <BookOpen className='h-5 w-5 text-blue-600' />
                      Acerca de esta Academia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground leading-relaxed'>
                      {academy.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Courses Section */}
              <motion.div variants={sectionVariants}>
                <Tabs defaultValue='courses' className='space-y-6'>
                  <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='courses'>
                      Cursos ({academy.courses_count || 0})
                    </TabsTrigger>
                    <TabsTrigger value='reviews'>
                      Reseñas ({academy.reviews_count || 0})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value='courses' className='space-y-4'>
                    {academy.courses && academy.courses.length > 0 ? (
                      <div className='grid gap-6'>
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
                        <CardContent className='py-12 text-center'>
                          <BookOpen className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                          <h3 className='mb-2 text-lg font-semibold'>
                            Próximamente
                          </h3>
                          <p className='text-muted-foreground'>
                            Esta academia está preparando contenido increíble.
                            ¡Mantente atento!
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value='reviews' className='space-y-4'>
                    <Card>
                      <CardContent className='py-12 text-center'>
                        <Star className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                        <h3 className='mb-2 text-lg font-semibold'>
                          Reseñas próximamente
                        </h3>
                        <p className='text-muted-foreground'>
                          Las reseñas de estudiantes estarán disponibles pronto.
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Right Column - Sidebar */}
            <div className='space-y-6'>
              {/* Instructor Card */}
              <motion.div variants={sectionVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='mb-4 flex items-center gap-4'>
                      <Avatar className='h-16 w-16'>
                        <AvatarImage src={academy.creator.avatar_url} />
                        <AvatarFallback>
                          {academy.creator.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className='text-lg font-semibold'>
                          {academy.creator.name}
                        </h3>
                        <p className='text-muted-foreground text-sm'>
                          Creador de la Academia
                        </p>
                      </div>
                    </div>
                    {academy.creator.bio && (
                      <p className='text-muted-foreground text-sm'>
                        {academy.creator.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Card */}
              <motion.div variants={sectionVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-lg'>Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Estudiantes
                      </span>
                      <span className='font-semibold'>
                        {(academy.enrolled_users_count || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-muted-foreground text-sm'>
                        Cursos
                      </span>
                      <span className='font-semibold'>
                        {academy.courses_count || 0}
                      </span>
                    </div>
                    {academy.total_lessons && (
                      <div className='flex items-center justify-between'>
                        <span className='text-muted-foreground text-sm'>
                          Lecciones
                        </span>
                        <span className='font-semibold'>
                          {academy.total_lessons}
                        </span>
                      </div>
                    )}
                    {academy.total_duration_hours && (
                      <div className='flex items-center justify-between'>
                        <span className='text-muted-foreground text-sm'>
                          Duración total
                        </span>
                        <span className='font-semibold'>
                          {academy.total_duration_hours}h
                        </span>
                      </div>
                    )}
                    {(academy.rating ||
                      academy.total_lessons ||
                      academy.total_duration_hours) && <Separator />}
                    {academy.rating && (
                      <div className='flex items-center justify-between'>
                        <span className='text-muted-foreground text-sm'>
                          Calificación
                        </span>
                        <div className='flex items-center gap-1'>
                          <Star className='h-4 w-4 fill-current text-yellow-500' />
                          <span className='font-semibold'>
                            {academy.rating}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Subscription Card */}
              <motion.div variants={sectionVariants}>
                <Card className='border-2 border-blue-200 bg-blue-50/50'>
                  <CardContent className='p-6'>
                    <div className='mb-4 text-center'>
                      <h3 className='mb-2 text-xl font-bold'>
                        Acceso Completo
                      </h3>
                      <div className='text-3xl font-bold text-blue-600'>
                        ${academy.monthly_price || 0}
                        <span className='text-muted-foreground text-lg font-normal'>
                          /mes
                        </span>
                      </div>
                    </div>

                    <div className='mb-6 space-y-3'>
                      <div className='flex items-center gap-2 text-sm'>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <span>Acceso a todos los cursos</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <span>Nuevos cursos cada mes</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <span>Certificados al completar</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <CheckCircle className='h-4 w-4 text-green-600' />
                        <span>Soporte del instructor</span>
                      </div>
                    </div>

                    <Button
                      className='w-full bg-blue-600 hover:bg-blue-700'
                      size='lg'
                    >
                      <ShoppingCart className='mr-2 h-4 w-4' />
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
