import { Link } from '@tanstack/react-router'
import type { LandingCourse } from '@/types/pages/home'
import { Star, Users, Clock, BookOpen } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

const categoryColors: Record<string, string> = {
  'Desarrollo Web': 'from-indigo-500/40 to-indigo-600/10',
  Diseno: 'from-pink-500/40 to-pink-600/10',
  'Inteligencia Artificial': 'from-emerald-500/40 to-emerald-600/10',
  Cloud: 'from-sky-500/40 to-sky-600/10',
  Backend: 'from-orange-500/40 to-orange-600/10',
  Mobile: 'from-violet-500/40 to-violet-600/10',
  Seguridad: 'from-red-500/40 to-red-600/10',
}

interface LandingCourseCardProps {
  course: LandingCourse
}

export function LandingCourseCard({ course }: LandingCourseCardProps) {
  const { t } = useTranslation()
  const gradient =
    categoryColors[course.category] ?? 'from-primary/30 to-primary/10'

  return (
    <article className='group border-border/50 bg-card hover:border-primary/40 relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] sm:w-[300px]'>
      {/* Thumbnail */}
      <div className={cn('relative h-40 w-full bg-gradient-to-br', gradient)}>
        <div className='absolute inset-0 flex items-center justify-center'>
          <BookOpen className='text-foreground/[0.08] size-10' />
        </div>
        <div className='from-card via-card/85 absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent' />
        <div className='absolute top-3 left-3'>
          <span className='bg-background/60 text-foreground/80 rounded-md px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm'>
            {course.category}
          </span>
        </div>
        <div className='absolute top-3 right-3'>
          <span className='bg-primary/90 text-primary-foreground rounded-md px-2.5 py-1 text-xs font-bold'>
            {course.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='relative z-[1] -mt-8 flex flex-1 flex-col gap-3 px-5 pb-5'>
        <h3
          className='text-foreground line-clamp-2 text-sm leading-snug font-semibold'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {course.title}
        </h3>
        <p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>
          {course.description}
        </p>
        <p className='text-muted-foreground/70 text-xs'>
          {t('pages.home.courses.card.by')}{' '}
          <span className='text-foreground/60 font-medium'>
            {course.instructor}
          </span>
        </p>
        <div className='text-muted-foreground flex flex-wrap items-center gap-3 text-[11px]'>
          <span className='flex items-center gap-1'>
            <Clock className='size-3' />
            {course.duration}
          </span>
          <span className='flex items-center gap-1'>
            <BookOpen className='size-3' />
            {course.totalLessons} {t('pages.home.courses.card.lessons')}
          </span>
          <span className='flex items-center gap-1'>
            <Star className='size-3 fill-amber-400 text-amber-400' />
            {course.rating}
          </span>
          <span className='flex items-center gap-1'>
            <Users className='size-3' />
            {new Intl.NumberFormat('es').format(course.students)}
          </span>
        </div>
        <Link to='/courses'>
          <button className='bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 mt-auto flex h-9 w-full items-center justify-center rounded-lg border text-xs font-medium transition-colors'>
            {t('pages.home.courses.card.viewCourse')}
          </button>
        </Link>
      </div>
    </article>
  )
}
