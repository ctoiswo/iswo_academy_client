import { motion } from 'framer-motion'
import { BookOpen, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseCard } from '@/components/course-card'

interface MainContentProps {
  academy: any
}

export function MainContent({ academy }: MainContentProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
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
                {academy.courses.map((course: any, index: number) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className='py-12 text-center'>
                  <BookOpen className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <h3 className='mb-2 text-lg font-semibold'>Próximamente</h3>
                  <p className='text-muted-foreground'>
                    Esta academia está preparando contenido increíble. ¡Mantente
                    atento!
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
  )
}
