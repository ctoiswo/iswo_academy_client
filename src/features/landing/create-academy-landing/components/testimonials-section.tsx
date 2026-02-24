import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Maria Rodriguez',
    role: 'Fundadora, Academia de UX/UI',
    avatar: 'MR',
    text: 'Desde que lance mi academia en ISWO, mis ingresos pasivos se triplicaron. La plataforma es increiblemente facil de usar y el soporte es excepcional.',
    rating: 5,
    stats: '450 estudiantes activos',
  },
  {
    name: 'Carlos Mendez',
    role: 'Instructor de Desarrollo Web',
    avatar: 'CM',
    text: 'Lo que mas me gusto es que no tuve que preocuparme por nada tecnico. Solo me dedique a crear contenido de calidad y ISWO se encargo del resto.',
    rating: 5,
    stats: '1,200+ cursos vendidos',
  },
  {
    name: 'Ana Lucia Torres',
    role: 'Experta en Marketing Digital',
    avatar: 'AT',
    text: 'La visibilidad que me da el marketplace es increible. Estudiantes de toda Latinoamerica encuentran mi academia organicamente. Es un game-changer.',
    rating: 5,
    stats: '$15,000+ en ganancias',
  },
  {
    name: 'Diego Fernandez',
    role: 'Academy de Cloud Computing',
    avatar: 'DF',
    text: 'Migre mi academia de otra plataforma y fue la mejor decision. Las analiticas avanzadas me permiten entender exactamente que necesitan mis estudiantes.',
    rating: 5,
    stats: '98% satisfaccion',
  },
  {
    name: 'Sofia Vargas',
    role: 'Instructora de Data Science',
    avatar: 'SV',
    text: 'Los certificados automaticos y el sistema de pagos integrado me ahorraron horas de trabajo administrativo. Ahora solo me enfoco en ensenar.',
    rating: 5,
    stats: '320 certificados emitidos',
  },
]

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = (index: number) => {
    setActiveIndex((index + testimonials.length) % testimonials.length)
  }

  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-12'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            Testimonios
          </span>
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Creadores que ya confian en nosotros
          </h2>
          <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
            Mas de 120 academias creadas y creciendo. Esto es lo que dicen nuestros creadores.
          </p>
        </div>

        <div className='relative max-w-3xl mx-auto w-full'>
          <div className='relative rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-8 sm:p-10 overflow-hidden'>
            <Quote className='absolute top-6 right-6 size-20 text-primary/5' aria-hidden='true' />

            <div className='relative z-10 flex flex-col gap-6'>
              <div className='flex gap-1'>
                {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                  <Star key={i} className='size-4 fill-amber-400 text-amber-400' />
                ))}
              </div>

              <blockquote className='text-base sm:text-lg text-foreground/90 leading-relaxed font-medium min-h-[80px]'>
                {`"${testimonials[activeIndex].text}"`}
              </blockquote>

              <div className='flex items-center justify-between pt-4 border-t border-border/30'>
                <div className='flex items-center gap-3'>
                  <div
                    className='flex items-center justify-center size-11 rounded-full bg-primary/10 border border-primary/20 text-sm font-bold text-primary'
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {testimonials[activeIndex].avatar}
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold text-foreground'>
                      {testimonials[activeIndex].name}
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      {testimonials[activeIndex].role}
                    </span>
                  </div>
                </div>
                <span className='hidden sm:inline text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full'>
                  {testimonials[activeIndex].stats}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className='flex items-center justify-center gap-4 mt-6'>
            <button
              onClick={() => goTo(activeIndex - 1)}
              className='flex items-center justify-center size-9 rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'
              aria-label='Anterior'
            >
              <ChevronLeft className='size-4' />
            </button>

            <div className='flex items-center gap-2'>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    i === activeIndex
                      ? 'w-6 h-2 bg-primary'
                      : 'size-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  )}
                  aria-label={`Testimonio ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(activeIndex + 1)}
              className='flex items-center justify-center size-9 rounded-lg border border-border/50 bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors'
              aria-label='Siguiente'
            >
              <ChevronRight className='size-4' />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
