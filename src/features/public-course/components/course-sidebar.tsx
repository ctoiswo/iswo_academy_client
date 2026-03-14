import type { Course, DifficultyLevel } from '@/types'
import { motion } from 'framer-motion'
import {
  Play,
  Heart,
  Share2,
  Clock,
  BookOpen,
  Globe,
  Infinity as InfinityIcon,
  Download,
  TrendingUp,
  Shield,
  Smartphone,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface CourseSidebarProps {
  course: Course & {
    sections: Array<{
      id: number
      title: string
      lessons: number
      duration: number
    }>
    promotional_video_url?: string
    promotional_video_embedded_url?: string
    promotional_image_url?: string
  }
  isSaved: boolean
  onSaveClick: () => void
  onShareClick: () => void
  onEnrollClick: () => void
  onVideoClick?: () => void
  formatPrice: (price: string) => string
  formatDifficulty: (level: DifficultyLevel) => string
}

export function CourseSidebar({
  course,
  isSaved,
  onSaveClick,
  onShareClick,
  onEnrollClick,
  onVideoClick,
  formatPrice,
  formatDifficulty,
}: CourseSidebarProps) {
  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons, 0)
  const hasPromoVideo = course.promotional_video_embedded_url || course.promotional_video_url

  return (
    <div className='lg:col-span-1'>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className='sticky top-8 space-y-6'
      >
        {/* Main Purchase Card */}
        <Card className='overflow-hidden border-2 shadow-xl'>
          <CardContent className='p-0'>
            {/* Preview Image */}
            <div className='from-primary/20 to-primary/5 relative aspect-video w-full overflow-hidden bg-gradient-to-br'>
              <img
                src={(course.promotional_image_url || course.thumbnail_url) ?? ''}
                alt={course.title}
                className='h-full w-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
              
              {/* Video Play Button Overlay */}
              {hasPromoVideo && onVideoClick && (
                <button
                  onClick={onVideoClick}
                  className='absolute inset-0 flex items-center justify-center transition-all hover:bg-black/20'
                  aria-label='Reproducir video de vista previa'
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className='flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-2xl backdrop-blur-sm transition-all hover:bg-white'
                  >
                    <Play className='ml-1 h-8 w-8 fill-current text-foreground' />
                  </motion.div>
                  
                  {/* Preview Badge */}
                  <div className='absolute bottom-4 left-4 rounded-lg bg-black/80 px-3 py-1.5 backdrop-blur-sm'>
                    <p className='text-xs font-medium text-white'>Vista previa del curso</p>
                  </div>
                </button>
              )}
            </div>

            <div className='p-6'>
              {/* Price Section */}
              <div className='mb-6 text-center'>
                <div className='mb-2 text-4xl font-bold'>
                  {course.is_free ? (
                    <span className='bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                      Gratis
                    </span>
                  ) : (
                    <span className='from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-transparent'>
                      {formatPrice(course.price.toString())}
                    </span>
                  )}
                </div>
                <p className='text-muted-foreground text-sm font-medium'>
                  {course.pricing_type === 'one_time'
                    ? 'Pago único - Acceso de por vida'
                    : 'Acceso completo ilimitado'}
                </p>
                {!course.is_free && (course.enrollment_count ?? 0) > 100 && (
                  <Badge variant='secondary' className='mt-2'>
                    <TrendingUp className='mr-1 h-3 w-3' />
                    {course.enrollment_count} estudiantes inscritos
                  </Badge>
                )}
              </div>

              {/* CTA Buttons */}
              <div className='mb-6 space-y-3'>
                <Button
                  className='h-12 w-full text-base font-semibold shadow-lg'
                  size='lg'
                  onClick={onEnrollClick}
                >
                  <Play className='mr-2 h-5 w-5' />
                  Inscribirse ahora
                </Button>

                <div className='grid grid-cols-2 gap-2'>
                  <Button
                    variant={isSaved ? 'default' : 'outline'}
                    size='sm'
                    onClick={onSaveClick}
                    className='h-10'
                  >
                    <Heart
                      className={`mr-1 h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                    />
                    {isSaved ? 'Guardado' : 'Guardar'}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={onShareClick}
                    className='h-10'
                  >
                    <Share2 className='mr-1 h-4 w-4' />
                    Compartir
                  </Button>
                </div>
              </div>

              <Separator className='my-6' />

              {/* Course Details */}
              <div className='space-y-4'>
                <h4 className='font-semibold'>Este curso incluye:</h4>

                <div className='space-y-3 text-sm'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                      <Clock className='text-primary h-4 w-4' />
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>
                        {Math.floor(course.duration_minutes / 60)}h{' '}
                        {course.duration_minutes % 60}min
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        de video bajo demanda
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                      <BookOpen className='text-primary h-4 w-4' />
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>
                        {totalLessons} lecciones
                      </div>
                      <div className='text-muted-foreground text-xs'>
                        en {course.sections.length} secciones
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                      <Smartphone className='text-primary h-4 w-4' />
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>Acceso móvil</div>
                      <div className='text-muted-foreground text-xs'>
                        En cualquier dispositivo
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                      <InfinityIcon className='text-primary h-4 w-4' />
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>Acceso completo</div>
                      <div className='text-muted-foreground text-xs'>
                        De por vida
                      </div>
                    </div>
                  </div>

                  {course.certificate_enabled && (
                    <div className='flex items-center gap-3'>
                      <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                        <Download className='text-primary h-4 w-4' />
                      </div>
                      <div className='flex-1'>
                        <div className='font-medium'>Certificado</div>
                        <div className='text-muted-foreground text-xs'>
                          Al finalizar el curso
                        </div>
                      </div>
                    </div>
                  )}

                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                      <Globe className='text-primary h-4 w-4' />
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium'>Idioma: Español</div>
                      <div className='text-muted-foreground text-xs'>
                        Subtítulos disponibles
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className='my-6' />

              {/* Additional Info */}
              <div className='space-y-3 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Nivel:</span>
                  <Badge variant='outline'>
                    {formatDifficulty(course.difficulty_level)}
                  </Badge>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground'>Actualizado:</span>
                  <span className='font-medium'>
                    {new Date(course.updated_at).toLocaleDateString('es-ES', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {/* Guarantee Badge */}
              <div className='mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-950/20'>
                <div className='flex items-center gap-3'>
                  <Shield className='h-6 w-6 text-green-600' />
                  <div className='text-xs'>
                    <div className='font-semibold text-green-900 dark:text-green-100'>
                      Garantía de 30 días
                    </div>
                    <div className='text-green-700 dark:text-green-300'>
                      Reembolso completo si no estás satisfecho
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card (Mobile visible) */}
        <Card className='lg:hidden'>
          <CardContent className='p-4'>
            <div className='grid grid-cols-3 gap-4 text-center'>
              <div>
                <div className='text-primary mb-1 text-2xl font-bold'>
                  {course.sections?.length || 0}
                </div>
                <div className='text-muted-foreground text-xs'>Secciones</div>
              </div>
              <div>
                <div className='text-primary mb-1 text-2xl font-bold'>
                  {totalLessons}
                </div>
                <div className='text-muted-foreground text-xs'>Lecciones</div>
              </div>
              <div>
                <div className='text-primary mb-1 text-2xl font-bold'>
                  {Math.round(course.duration_minutes / 60)}h
                </div>
                <div className='text-muted-foreground text-xs'>Duración</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
