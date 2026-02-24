import { cn } from '@/lib/utils'
import { Palette, BarChart3, Globe, Shield, CreditCard, Headphones } from 'lucide-react'

const benefits = [
  {
    icon: Palette,
    title: 'Tu marca, tu academia',
    description: 'Personaliza colores, logo y dominio. Tus estudiantes veran TU marca, no la nuestra.',
    accent: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: BarChart3,
    title: 'Analiticas avanzadas',
    description: 'Monitorea inscripciones, ingresos, progreso de estudiantes y tasas de finalizacion en tiempo real.',
    accent: 'from-emerald-500 to-teal-600',
  },
  {
    icon: Globe,
    title: 'Alcance global',
    description: 'Tu academia sera visible en nuestro marketplace con miles de estudiantes activos buscando aprender.',
    accent: 'from-sky-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Hosting y seguridad',
    description: 'Nosotros nos encargamos de la infraestructura, SSL, backups y rendimiento. Tu solo crea contenido.',
    accent: 'from-amber-500 to-orange-600',
  },
  {
    icon: CreditCard,
    title: 'Pagos integrados',
    description: 'Recibe pagos de tus estudiantes directamente. Stripe, PayPal y transferencias bancarias incluidos.',
    accent: 'from-pink-500 to-rose-600',
  },
  {
    icon: Headphones,
    title: 'Soporte dedicado',
    description: 'Equipo de soporte listo para ayudarte con cualquier duda tecnica o estrategica.',
    accent: 'from-violet-500 to-purple-600',
  },
]

export function BenefitsSection() {
  return (
    <section className='relative py-24'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-12'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            Ventajas
          </span>
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Todo lo que necesitas para lanzar tu academia
          </h2>
          <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
            Enfocate en crear contenido increible. Nosotros nos encargamos de todo lo demas.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          {benefits.map((b) => {
            const Icon = b.icon
            return (
              <article
                key={b.title}
                className='group relative flex flex-col gap-4 p-6 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/70 hover:shadow-[0_0_24px_rgba(99,102,241,0.06)]'
              >
                <div className={cn('flex items-center justify-center size-11 rounded-xl bg-gradient-to-br', b.accent)}>
                  <Icon className='size-5 text-foreground' />
                </div>
                <h3
                  className='text-base font-semibold text-foreground'
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {b.title}
                </h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>{b.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
