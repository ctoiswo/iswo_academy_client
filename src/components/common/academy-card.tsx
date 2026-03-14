import { Link } from '@tanstack/react-router'
import type { AcademyCardProps } from '@/types/pages/home'
import { Users, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AcademyCard({
  academy,
  accentFrom,
  accentTo,
  index = 0,
}: AcademyCardProps) {
  return (
    <article
      className='group/card border-border/40 bg-card hover:border-border/70 relative flex w-[220px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          'relative h-[130px] w-full shrink-0 overflow-hidden bg-gradient-to-br',
          accentFrom,
          accentTo
        )}
      >
        {academy.cover_image && (
          <img
            src={academy.cover_image}
            alt={academy.name}
            className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.06]'
            loading='lazy'
          />
        )}
        <div className='from-card via-card/80 absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent' />
        <div
          className={cn(
            'absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r',
            accentFrom,
            accentTo
          )}
        />
      </div>

      {/* Content */}
      <div className='relative z-[1] -mt-6 flex flex-col gap-2.5 px-4 pb-4'>
        <h4
          className='text-foreground line-clamp-2 text-[13px] leading-snug font-semibold'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {academy.name}
        </h4>

        {academy.description && (
          <p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>
            {academy.description}
          </p>
        )}

        {academy.instructor && (
          <p className='text-muted-foreground/60 text-[11px]'>
            por{' '}
            <span className='text-foreground/50 font-medium'>
              {academy.instructor}
            </span>
          </p>
        )}

        <div className='text-muted-foreground border-border/20 mt-auto flex items-center gap-3 border-t pt-2 text-[11px]'>
          <span className='flex items-center gap-1'>
            <BookOpen className='size-3' />
            {academy.courses_count} cursos
          </span>
          <span className='flex items-center gap-1'>
            <Users className='size-3' />
            {new Intl.NumberFormat('es').format(academy.students_count)}
          </span>
        </div>

        <Link to='/academies/$slug' params={{ slug: academy.slug }}>
          <button className='border-border/40 bg-muted/40 text-foreground/70 hover:bg-muted/70 hover:text-foreground hover:border-border/60 mt-1 flex h-8 w-full items-center justify-center rounded-lg border text-xs font-medium transition-colors'>
            Ver academia
          </button>
        </Link>
      </div>
    </article>
  )
}
