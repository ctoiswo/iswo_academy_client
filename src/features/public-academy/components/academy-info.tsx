import { motion } from 'framer-motion'
import { Clock, BookOpen, Users, Award } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AcademyInfoProps {
  academy: {
    description?: string | null
    mission?: string | null
    vision?: string | null
    courses_count?: number
    enrolled_users_count?: number
    creator?: {
      name?: string
      first_name?: string | null
      last_name?: string | null
      email?: string
    } | null
    courses?: Array<{
      duration_minutes?: number
      [key: string]: any
    }>
  }
}

export function AcademyInfo({ academy }: AcademyInfoProps) {
  const creatorName =
    academy.creator?.name ||
    `${academy.creator?.first_name || ''} ${academy.creator?.last_name || ''}`.trim() ||
    'Instructor'

  // Calculate total hours from courses
  const totalHours = academy.courses
    ? Math.round(
        academy.courses.reduce(
          (sum, course) => sum + (course.duration_minutes || 0),
          0
        ) / 60
      )
    : 0

  return (
    <section className='border-b py-16'>
      <div className='container'>
        <div className='grid gap-12 lg:grid-cols-3'>
          {/* Main info */}
          <div className='space-y-8 lg:col-span-2'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='mb-4 text-2xl font-bold'>Sobre esta academia</h2>
              <p className='text-muted-foreground leading-relaxed'>
                {academy.description || 'Descripción no disponible'}
              </p>

              {academy.mission && (
                <div className='mt-6'>
                  <h3 className='mb-2 text-lg font-semibold'>Misión</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {academy.mission}
                  </p>
                </div>
              )}

              {academy.vision && (
                <div className='mt-6'>
                  <h3 className='mb-2 text-lg font-semibold'>Visión</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {academy.vision}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Instructor info */}
            {academy.creator && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className='mb-6 text-2xl font-bold'>Creado por</h2>
                <div className='flex items-start space-x-4'>
                  <div className='bg-primary flex h-16 w-16 items-center justify-center rounded-full text-2xl font-semibold text-white'>
                    {creatorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className='text-xl font-semibold'>{creatorName}</h3>
                    {academy.creator.email && (
                      <p className='text-muted-foreground mt-1 text-sm'>
                        {academy.creator.email}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Stats sidebar */}
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
                  {totalHours > 0 && (
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Clock className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Contenido total</span>
                      </div>
                      <span className='font-medium'>{totalHours} horas</span>
                    </div>
                  )}

                  {academy.courses_count !== undefined && (
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <BookOpen className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Cursos</span>
                      </div>
                      <span className='font-medium'>
                        {academy.courses_count}
                      </span>
                    </div>
                  )}

                  {academy.enrolled_users_count !== undefined && (
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-2'>
                        <Users className='text-muted-foreground h-4 w-4' />
                        <span className='text-sm'>Estudiantes</span>
                      </div>
                      <span className='font-medium'>
                        {academy.enrolled_users_count.toLocaleString()}
                      </span>
                    </div>
                  )}

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
          </div>
        </div>
      </div>
    </section>
  )
}
