import type { Course } from '@/types'
import { motion } from 'framer-motion'
import { Play, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface CourseSidebarProps {
  course: Course & {
    sections: Array<{
      id: number
      title: string
      lessons: number
      duration: number
    }>
  }
  isSaved: boolean
  onSaveClick: () => void
  onShareClick: () => void
  formatPrice: (price: string) => string
  formatDifficulty: (level: string) => string
}

export function CourseSidebar({
  course,
  isSaved,
  onSaveClick,
  onShareClick,
  formatPrice,
  formatDifficulty,
}: CourseSidebarProps) {
  return (
    <div className='lg:col-span-1'>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='sticky top-8'
      >
        <Card className='shadow-lg'>
          <CardContent className='p-6'>
            <div className='mb-6 text-center'>
              <div className='mb-2 text-3xl font-bold'>
                {course.is_free ? (
                  <span className='text-green-600'>Gratis</span>
                ) : (
                  <span>{formatPrice(course.price.toString())}</span>
                )}
              </div>
              <p className='text-muted-foreground text-sm'>
                Acceso completo de por vida
              </p>
            </div>

            <div className='mb-6 space-y-4'>
              <Button className='w-full' size='lg'>
                <Play className='mr-2 h-4 w-4' />
                Inscribirse al curso
              </Button>

              <div className='flex gap-2'>
                <Button
                  variant={isSaved ? 'default' : 'outline'}
                  size='sm'
                  className='flex-1'
                  onClick={onSaveClick}
                >
                  <Heart
                    className={`mr-1 h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                  />
                  {isSaved ? 'Guardado' : 'Guardar'}
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex-1'
                  onClick={onShareClick}
                >
                  <Share2 className='mr-1 h-4 w-4' />
                  Compartir
                </Button>
              </div>
            </div>

            <div className='space-y-3 text-sm'>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Nivel:</span>
                <span>{formatDifficulty(course.difficulty_level)}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Duración:</span>
                <span>{Math.round(course.duration_minutes / 60)} horas</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Lecciones:</span>
                <span>
                  {course.sections.reduce((sum, s) => sum + s.lessons, 0)}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Idioma:</span>
                <span>Español</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Acceso:</span>
                <span>De por vida</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
