import { useParams, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Settings,
  Clock,
  DollarSign,
  BarChart3,
  Calendar,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCourse } from '@/hooks/use-courses'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AccessCodeList } from '@/components/access-codes/access-code-list'

export default function CourseInfoPage() {
  const params = useParams({ strict: false }) as {
    academySlug: string
    courseSlug: string
  }
  const { academySlug, courseSlug } = params
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { data: course, isLoading, error } = useCourse(courseSlug)

  if (isLoading) {
    return (
      <div className='container mx-auto py-8'>
        <div className='space-y-6'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-32' />
          <Skeleton className='h-64' />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='container mx-auto py-8'>
        <div className='py-12 text-center'>
          <h3 className='text-destructive mb-2 text-lg font-bold'>
            {t('courseInfo.errorTitle')}
          </h3>
          <p className='text-muted-foreground'>
            {t('courseInfo.errorDescription')}
          </p>
          <Link
            to='/academy/$academySlug/admin/courses'
            params={{ academySlug }}
            className='mt-4 inline-block'
          >
            <Button variant='outline'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              {t('courseInfo.backToCourses')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <div className='mb-6'>
        <div className='mb-4 flex items-start justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold'>{course.title}</h1>
            <p className='text-muted-foreground'>{course.description}</p>
          </div>
          <Button
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/courses/$courseSlug/edit',
                params: { academySlug, courseSlug },
              })
            }
          >
            <Settings className='mr-2 h-4 w-4' />
            {t('courseInfo.editCourse')}
          </Button>
        </div>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>{t('courseInfo.generalInfo')}</CardTitle>
            <CardDescription>{t('courseInfo.generalInfoDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
              {/* Estado */}
              <div className='flex flex-col'>
                <div className='text-muted-foreground mb-2 flex items-center gap-2'>
                  <BarChart3 className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    {t('courseInfo.status')}
                  </span>
                </div>
                <Badge
                  variant={
                    course.status === 'published' ? 'default' : 'secondary'
                  }
                  className='w-fit'
                >
                  {course.status === 'published'
                    ? t('courseInfo.statusPublished')
                    : course.status === 'draft'
                      ? t('courseInfo.statusDraft')
                      : t('courseInfo.statusArchived')}
                </Badge>
              </div>

              {/* Nivel de Dificultad */}
              <div className='flex flex-col'>
                <div className='text-muted-foreground mb-2 flex items-center gap-2'>
                  <BarChart3 className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    {t('courseInfo.level')}
                  </span>
                </div>
                <Badge variant='outline' className='w-fit'>
                  {t(`myCourses.difficulty.${course.difficulty_level}`, {
                    defaultValue: course.difficulty_level,
                  })}
                </Badge>
              </div>

              {/* Precio */}
              <div className='flex flex-col'>
                <div className='text-muted-foreground mb-2 flex items-center gap-2'>
                  <DollarSign className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    {t('courseInfo.price')}
                  </span>
                </div>
                <p className='text-lg font-semibold text-emerald-500'>
                  {course.is_free
                    ? t('courseInfo.free')
                    : `$${Number(course.price).toLocaleString()}`}
                </p>
              </div>

              {/* Duración */}
              <div className='flex flex-col'>
                <div className='text-muted-foreground mb-2 flex items-center gap-2'>
                  <Clock className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    {t('courseInfo.duration')}
                  </span>
                </div>
                <p className='text-foreground text-lg font-semibold'>
                  {Math.floor(course.duration_minutes / 60)}h{' '}
                  {course.duration_minutes % 60}m
                </p>
              </div>
            </div>

            {/* Fechas */}
            <div className='mt-6 grid grid-cols-2 gap-6 border-t pt-6'>
              <div className='flex flex-col'>
                <div className='text-muted-foreground mb-1 flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    {t('courseInfo.createdAt')}
                  </span>
                </div>
                <p className='text-foreground text-sm'>
                  {new Date(course.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className='flex flex-col'>
                <div className='text-muted-foreground mb-1 flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  <span className='text-sm font-medium'>
                    {t('courseInfo.updatedAt')}
                  </span>
                </div>
                <p className='text-foreground text-sm'>
                  {new Date(course.updated_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {course.thumbnail_url && (
              <div className='mt-6 border-t pt-6'>
                <h4 className='text-muted-foreground mb-3 text-sm font-medium'>
                  {t('courseInfo.thumbnail')}
                </h4>
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className='w-full max-w-2xl rounded-lg border shadow-sm'
                />
              </div>
            )}
          </CardContent>
        </Card>
        <AccessCodeList courseSlug={course.slug} />
      </div>
    </div>
  )
}
