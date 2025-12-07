import { motion } from 'framer-motion'
import { Star, CheckCircle, ShoppingCart } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  academy: any
}

export function Sidebar({ academy }: SidebarProps) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
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
                    .map((n: string) => n[0])
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
  )
}