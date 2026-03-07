import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

export function AcademyFaq() {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = t('createAcademyLanding.faq.items', {
    returnObjects: true,
  }) as FaqItem[]

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className='relative py-24 bg-muted/20'>
      <div className='max-w-7xl mx-auto px-4 lg:px-8 flex flex-col gap-12'>
        <div className='flex flex-col items-center gap-4 text-center'>
          <span className='text-xs font-semibold uppercase tracking-widest text-primary'>
            {t('createAcademyLanding.faq.eyebrow')}
          </span>
          <h2
            className='text-3xl sm:text-4xl font-bold text-foreground tracking-tight text-balance'
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('createAcademyLanding.faq.title')}
          </h2>
          <p className='text-sm text-muted-foreground max-w-lg leading-relaxed'>
            {t('createAcademyLanding.faq.subtitle')}
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
