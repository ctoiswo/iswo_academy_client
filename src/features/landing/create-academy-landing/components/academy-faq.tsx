import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: '¿Cuanto tiempo tarda en activarse mi academia?',
    answer:
      'Tu academia puede estar activa en menos de 24 horas. Solo necesitas registrarte, configurar tu perfil y subir tu primer contenido. Nuestro equipo revisa las academias para garantizar la calidad y te notificamos cuando este lista.',
  },
  {
    question: '¿Que porcentaje de los ingresos me corresponde?',
    answer:
      'Dependiendo de tu plan, recibes entre el 70% y el 90% de cada venta. En el Plan Starter obtienes 70%, en Pro 80% y en Enterprise 90%. Los pagos se procesan cada 30 dias directamente a tu cuenta bancaria o PayPal.',
  },
  {
    question: '¿Necesito conocimientos tecnicos para crear mi academia?',
    answer:
      'Para nada. ISWO Academy esta disenada para que cualquier persona pueda crear y gestionar su academia sin saber programacion. Tenemos tutoriales paso a paso, soporte en vivo y una interfaz intuitiva que te guia durante todo el proceso.',
  },
  {
    question: '¿Que tipos de contenido puedo subir?',
    answer:
      'Puedes subir videos (MP4, MKV hasta 4GB por archivo), PDFs, presentaciones, archivos de audio y texto enriquecido. Tambien puedes incrustar quizzes interactivos, tareas con revision manual y proyectos practicos.',
  },
  {
    question: '¿Puedo migrar mis cursos desde otra plataforma?',
    answer:
      'Si. Ofrecemos un servicio de migracion asistida para creadores que vienen de Hotmart, Teachable, Udemy, Kajabi o cualquier otra plataforma. Nuestro equipo tecnico te acompana durante todo el proceso sin costo adicional en los planes Pro y Enterprise.',
  },
  {
    question: '¿Como funciona el marketplace de ISWO?',
    answer:
      'Tu academia aparece organicamente en el marketplace de ISWO, donde miles de estudiantes buscan cursos cada dia. Cuanto mejor sea tu contenido y valoraciones, mayor visibilidad tendra tu academia. Ademas, participas en campanas de descuento estacionales que nosotros promocionamos.',
  },
  {
    question: '¿Puedo cancelar o cambiar de plan en cualquier momento?',
    answer:
      'Si, puedes cambiar de plan o cancelar tu suscripcion en cualquier momento desde tu panel de control. No hay permanencia ni penalizaciones. Si cancelas, tu academia permanece activa hasta el fin del periodo pagado.',
  },
]

export function AcademyFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  return (
    <section className='relative py-24 bg-muted/20'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-12'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>FAQ</span>
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Preguntas frecuentes
          </h2>
          <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
            Todo lo que necesitas saber antes de crear tu academia. Si tienes mas dudas, nuestro
            equipo esta disponible 24/7.
          </p>
        </div>

        <div className='max-w-3xl mx-auto w-full flex flex-col gap-3'>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={cn(
                  'rounded-xl border transition-colors duration-200',
                  isOpen ? 'border-primary/30 bg-card/80' : 'border-border/40 bg-card/40'
                )}
              >
                <button
                  className='w-full flex items-center justify-between gap-4 px-6 py-5 text-left'
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      'text-sm sm:text-base font-semibold leading-snug transition-colors',
                      isOpen ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 text-muted-foreground transition-transform duration-300',
                      isOpen && 'rotate-180 text-primary'
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out',
                    isOpen ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <p className='px-6 pb-5 text-sm text-muted-foreground leading-relaxed'>
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
