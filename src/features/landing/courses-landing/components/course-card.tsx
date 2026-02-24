import { Link } from '@tanstack/react-router'
import { BookOpen, Clock, Star, Users, CheckCircle, Award } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn, formatDuration, formatPrice } from '@/lib/utils'
import { type Course } from '@/types'
import { type DifficultyLevel } from '@/types/entities/course'

const CATEGORY_COLORS: Record<string, string> = {
  'Desarrollo Web': 'from-indigo-500/40 to-indigo-600/10',
  'Diseno': 'from-pink-500/40 to-pink-600/10',
  'Diseño': 'from-pink-500/40 to-pink-600/10',
  'Inteligencia Artificial': 'from-emerald-500/40 to-emerald-600/10',
  'Cloud': 'from-sky-500/40 to-sky-600/10',
  'Backend': 'from-orange-500/40 to-orange-600/10',
  'Mobile': 'from-violet-500/40 to-violet-600/10',
  'Seguridad': 'from-red-500/40 to-red-600/10',
}

const DIFFICULTY_STYLES: Record<DifficultyLevel, string> = {
  beginner: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  intermediate: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
  advanced: 'text-red-600 bg-red-500/10 border-red-500/20',
}

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const { t } = useTranslation()
  const gradient = CATEGORY_COLORS[course.category ?? ''] ?? 'from-primary/30 to-primary/10'
  const isEnrolled = course.enrolled === true

  return (
    <article className='group relative flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]'>
      {/* Thumbnail */}
      <div className={cn('relative h-40 w-full bg-gradient-to-br', gradient)}>
        {course.promotional_image_url ? (
          <img
            src={course.promotional_image_url}
            alt={course.title}
            className='absolute inset-0 w-full h-full object-cover'
          />
        ) : (
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='size-10 text-foreground/[0.08]' />
          </div>
        )}
        <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/85 to-transparent' />

        <div className='absolute top-3 left-3'>
          <span className='text-[11px] font-medium px-2.5 py-1 rounded-md bg-background/60 backdrop-blur-sm text-foreground/80'>
            {course.category ?? t('coursesLanding.card.general')}
          </span>
        </div>

        <div className='absolute top-3 right-3'>
          <span className='text-xs font-bold px-2.5 py-1 rounded-md bg-primary/90 text-primary-foreground'>
            {formatPrice(course)}
          </span>
        </div>

        {isEnrolled && (
          <div className='absolute bottom-3 right-3'>
            <span className='flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/90 text-white'>
              <CheckCircle className='size-2.5' />
              {course.progress_percentage != null && course.progress_percentage > 0
                ? `${Math.round(course.progress_percentage)}%`
                : t('coursesLanding.card.enrolled')}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col gap-3 px-5 pb-5 -mt-8 relative z-[1]'>
        <h3
          className='text-sm font-semibold leading-snug text-foreground line-clamp-2'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {course.title}
        </h3>

        {course.description && (
          <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
            {course.description}
          </p>
        )}

        {(course.creator || course.academy) && (
          <p className='text-xs text-muted-foreground/70 truncate'>
            {course.creator && (
              <>
                {t('coursesLanding.card.by')}{' '}
                <span className='text-foreground/60 font-medium'>{course.creator.name}</span>
              </>
            )}
            {course.creator && course.academy && (
              <span className='mx-1 opacity-40'>·</span>
            )}
            {course.academy && (
              <span className='text-foreground/50'>{course.academy.name}</span>
            )}
          </p>
        )}

        {/* Difficulty + certificate badges */}
        <div className='flex flex-wrap items-center gap-1.5'>
          <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-medium', DIFFICULTY_STYLES[course.difficulty_level])}>
            {t(`myCourses.difficulty.${course.difficulty_level}`)}
          </span>
          {course.certificate_enabled && (
            <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium text-primary border-primary/20 bg-primary/5'>
              <Award className='size-2.5' />
              {t('coursesLanding.card.certificate')}
            </span>
          )}
        </div>

        {/* Stats */}
        <div className='flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground'>
          {course.duration_minutes != null && course.duration_minutes > 0 && (
            <span className='flex items-center gap-1'>
              <Clock className='size-3' />
              {formatDuration(course.duration_minutes)}
            </span>
          )}
          {course.total_lessons != null && course.total_lessons > 0 && (
            <span className='flex items-center gap-1'>
              <BookOpen className='size-3' />
              {course.total_lessons} {t('coursesLanding.card.lessons')}
            </span>
          )}
          {course.average_rating != null && (
            <span className='flex items-center gap-1'>
              <Star className='size-3 text-amber-400 fill-amber-400' />
              {Number(course.average_rating).toFixed(1)}
            </span>
          )}
          {course.enrollment_count != null && course.enrollment_count > 0 && (
            <span className='flex items-center gap-1'>
              <Users className='size-3' />
              {new Intl.NumberFormat('es').format(course.enrollment_count)}
            </span>
          )}
        </div>

        {isEnrolled ? (
          <Link to='/courses/$courseSlug' params={{ courseSlug: course.slug }} className='mt-auto'>
            <button className='w-full h-9 flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-600 hover:bg-emerald-500/20 transition-colors'>
              {t('coursesLanding.card.continueCourse')}
            </button>
          </Link>
        ) : (
          <Link to='/sign-in' className='mt-auto'>
            <button className='w-full h-9 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary/20 transition-colors'>
              {t('coursesLanding.card.viewCourse')}
            </button>
          </Link>
        )}
      </div>
    </article>
  )
}

