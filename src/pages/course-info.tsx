import { useParams, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Settings,
  Clock,
  DollarSign,
  BarChart3,
  Calendar,
  ImageIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCourse } from '@/hooks/use-courses'
import { Button } from '@/components/ui/button'
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
      <div className='space-y-4 p-6'>
        <Skeleton className='h-32 w-full rounded-2xl' />
        <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className='h-20 rounded-xl' />
          ))}
        </div>
        <Skeleton className='h-48 rounded-xl' />
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className='p-6 text-center'>
        <h3 className='text-destructive mb-2 text-lg font-bold'>
          {t('courseInfo.errorTitle')}
        </h3>
        <p className='text-muted-foreground mb-4'>
          {t('courseInfo.errorDescription')}
        </p>
        <Link to='/academy/$academySlug/admin/courses' params={{ academySlug }}>
          <Button variant='outline'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            {t('courseInfo.backToCourses')}
          </Button>
        </Link>
      </div>
    )
  }

  const statusAccent =
    course.status === 'published'
      ? {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          label: t('courseInfo.statusPublished'),
        }
      : course.status === 'draft'
        ? {
            text: 'text-amber-400',
            bg: 'bg-amber-500/10',
            label: t('courseInfo.statusDraft'),
          }
        : {
            text: 'text-muted-foreground',
            bg: 'bg-muted/40',
            label: t('courseInfo.statusArchived'),
          }

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Header */}
      <div className='border-border/60 from-card via-card to-primary/5 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6'>
        <div className='bg-primary/10 absolute top-0 right-0 h-48 w-48 translate-x-1/3 -translate-y-1/3 rounded-full blur-[80px]' />
        <div className='relative z-10 flex items-start justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <Link
              to='/academy/$academySlug/courses/$courseSlug'
              params={{ academySlug, courseSlug }}
              className='text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-sm transition-colors'
            >
              <ArrowLeft className='size-3.5' />
              Volver al curso
            </Link>
            <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
              {course.title}
            </h1>
            {course.description && (
              <p className='text-muted-foreground max-w-2xl text-sm'>
                {course.description}
              </p>
            )}
          </div>
          <Button
            onClick={() =>
              navigate({
                to: '/academy/$academySlug/courses/$courseSlug/edit',
                params: { academySlug, courseSlug },
              })
            }
            className='bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 font-semibold shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]'
          >
            <Settings className='mr-2 h-4 w-4' />
            {t('courseInfo.editCourse')}
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {/* Status */}
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className={`rounded-lg p-2 ${statusAccent.bg}`}>
            <BarChart3 className={`size-4 ${statusAccent.text}`} />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>
              {t('courseInfo.status')}
            </p>
            <p className={`text-sm font-semibold ${statusAccent.text}`}>
              {statusAccent.label}
            </p>
          </div>
        </div>

        {/* Level */}
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='bg-primary/10 rounded-lg p-2'>
            <BarChart3 className='text-primary size-4' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>
              {t('courseInfo.level')}
            </p>
            <p className='text-foreground text-sm font-semibold capitalize'>
              {t(`myCourses.difficulty.${course.difficulty_level}`, {
                defaultValue: course.difficulty_level,
              })}
            </p>
          </div>
        </div>

        {/* Price */}
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='rounded-lg bg-emerald-500/10 p-2'>
            <DollarSign className='size-4 text-emerald-400' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>
              {t('courseInfo.price')}
            </p>
            <p className='text-sm font-semibold text-emerald-400'>
              {course.is_free
                ? t('courseInfo.free')
                : `$${Number(course.price).toLocaleString()}`}
            </p>
          </div>
        </div>

        {/* Duration */}
        <div className='border-border/60 bg-card flex items-center gap-3 rounded-xl border p-4'>
          <div className='rounded-lg bg-amber-500/10 p-2'>
            <Clock className='size-4 text-amber-400' />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-xs'>
              {t('courseInfo.duration')}
            </p>
            <p className='text-foreground text-sm font-semibold'>
              {Math.floor(course.duration_minutes / 60)}h{' '}
              {course.duration_minutes % 60}m
            </p>
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className='border-border/60 bg-card rounded-xl border p-5'>
        <p className='text-muted-foreground mb-4 text-sm font-medium'>Fechas</p>
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-muted/40 rounded-lg p-3'>
            <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
              <Calendar className='size-3' />
              {t('courseInfo.createdAt')}
            </div>
            <p className='text-foreground text-sm font-semibold'>
              {new Date(course.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className='bg-muted/40 rounded-lg p-3'>
            <div className='text-muted-foreground mb-1 flex items-center gap-1.5 text-xs'>
              <Calendar className='size-3' />
              {t('courseInfo.updatedAt')}
            </div>
            <p className='text-foreground text-sm font-semibold'>
              {new Date(course.updated_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Thumbnail */}
      {course.thumbnail_url && (
        <div className='border-border/60 bg-card rounded-xl border p-5'>
          <div className='text-muted-foreground mb-3 flex items-center gap-1.5 text-sm font-medium'>
            <ImageIcon className='size-4' />
            {t('courseInfo.thumbnail')}
          </div>
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className='w-full max-w-2xl rounded-lg border shadow-sm'
          />
        </div>
      )}

      {/* Access Codes */}
      <AccessCodeList courseSlug={course.slug} />
    </div>
  )
}
