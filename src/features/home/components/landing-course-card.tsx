import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Star, Users, Clock, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LandingCourse } from '@/types/pages/home'

const categoryColors: Record<string, string> = {
  'Desarrollo Web': 'from-indigo-500/40 to-indigo-600/10',
  'Diseno': 'from-pink-500/40 to-pink-600/10',
  'Inteligencia Artificial': 'from-emerald-500/40 to-emerald-600/10',
  'Cloud': 'from-sky-500/40 to-sky-600/10',
  'Backend': 'from-orange-500/40 to-orange-600/10',
  'Mobile': 'from-violet-500/40 to-violet-600/10',
  'Seguridad': 'from-red-500/40 to-red-600/10',
}

interface LandingCourseCardProps {
  course: LandingCourse
}

export function LandingCourseCard({ course }: LandingCourseCardProps) {
  const { t } = useTranslation()
  const gradient = categoryColors[course.category] ?? 'from-primary/30 to-primary/10'

  return (
    <article className='group relative flex flex-col snap-start shrink-0 w-[280px] sm:w-[300px] rounded-xl border border-border/50 bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(99,102,241,0.08)]'>
      {/* Thumbnail */}
      <div className={cn('relative h-40 w-full bg-gradient-to-br', gradient)}>
        <div className='absolute inset-0 flex items-center justify-center'>
          <BookOpen className='size-10 text-foreground/[0.08]' />
        </div>
        <div className='absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card via-card/85 to-transparent' />
        <div className='absolute top-3 left-3'>
          <span className='text-[11px] font-medium px-2.5 py-1 rounded-md bg-background/60 backdrop-blur-sm text-foreground/80'>
            {course.category}
          </span>
        </div>
        <div className='absolute top-3 right-3'>
          <span className='text-xs font-bold px-2.5 py-1 rounded-md bg-primary/90 text-primary-foreground'>
            {course.price}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col gap-3 px-5 pb-5 -mt-8 relative z-[1]'>
        <h3
          className='text-sm font-semibold leading-snug text-foreground line-clamp-2'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {course.title}
        </h3>
        <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
          {course.description}
        </p>
        <p className='text-xs text-muted-foreground/70'>
          {t('pages.home.courses.card.by')} <span className='text-foreground/60 font-medium'>{course.instructor}</span>
        </p>
        <div className='flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground'>
          <span className='flex items-center gap-1'><Clock className='size-3' />{course.duration}</span>
          <span className='flex items-center gap-1'><BookOpen className='size-3' />{course.totalLessons} {t('pages.home.courses.card.lessons')}</span>
          <span className='flex items-center gap-1'><Star className='size-3 text-amber-400 fill-amber-400' />{course.rating}</span>
          <span className='flex items-center gap-1'><Users className='size-3' />{new Intl.NumberFormat('es').format(course.students)}</span>
        </div>
        <Link to='/courses'>
          <button className='mt-auto w-full h-9 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary/20 transition-colors'>
            {t('pages.home.courses.card.viewCourse')}
          </button>
        </Link>
      </div>
    </article>
  )
}
