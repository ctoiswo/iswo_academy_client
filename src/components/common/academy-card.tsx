import { Link } from '@tanstack/react-router'
import { Users, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AcademyCardProps } from '@/types/pages/home'

export function AcademyCard({
  academy,
  accentFrom,
  accentTo,
  index = 0,
}: AcademyCardProps) {
  return (
    <article
      className='group/card relative flex flex-col snap-start shrink-0 w-[220px] rounded-xl border border-border/40 bg-card overflow-hidden transition-all duration-300 hover:border-border/70 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.25)]'
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Thumbnail */}
      <div className={cn('relative h-[130px] w-full shrink-0 overflow-hidden bg-gradient-to-br', accentFrom, accentTo)}>
        {academy.cover_image && (
          <img
            src={academy.cover_image}
            alt={academy.name}
            className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.06]'
            loading='lazy'
          />
        )}
        <div className='absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card via-card/80 to-transparent' />
        <div className={cn('absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r', accentFrom, accentTo)} />
      </div>

      {/* Content */}
      <div className='flex flex-col gap-2.5 px-4 pb-4 -mt-6 relative z-[1]'>
        <h4
          className='text-[13px] font-semibold text-foreground leading-snug line-clamp-2'
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {academy.name}
        </h4>

        {academy.description && (
          <p className='text-xs text-muted-foreground leading-relaxed line-clamp-2'>
            {academy.description}
          </p>
        )}

        {academy.instructor && (
          <p className='text-[11px] text-muted-foreground/60'>
            por <span className='text-foreground/50 font-medium'>{academy.instructor}</span>
          </p>
        )}

        <div className='flex items-center gap-3 text-[11px] text-muted-foreground pt-2 mt-auto border-t border-border/20'>
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
          <button className='mt-1 w-full h-8 flex items-center justify-center rounded-lg border border-border/40 bg-muted/40 text-xs font-medium text-foreground/70 hover:bg-muted/70 hover:text-foreground hover:border-border/60 transition-colors'>
            Ver academia
          </button>
        </Link>
      </div>
    </article>
  )
}
